import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { ValueHistoryComponent } from '../value-history/value-history.component';
import { AuthService } from '../shared/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';  
import { BluButton } from 'projects/blueprint/src/lib/button/button.component';
import { BluModal } from 'projects/blueprint/src/lib/modal/modal.component';
import { BehaviorSubject } from 'rxjs';
import { DataService } from '../shared/services/data.service';
import { Asset } from '../shared/constants/constants';
import { BluSpinner } from 'projects/blueprint/src/lib/spinner/spinner.component';

@Component({
  selector: 'app-asset-details-page',
  standalone: true,
  imports: [CommonModule, ValueHistoryComponent, MatTabsModule, BluButton, BluModal, BluSpinner],
  templateUrl: './asset-details-page.component.html',
  styleUrl: './asset-details-page.component.scss'
})
export class AssetDetailsPageComponent {
  public userId: string = this.authService.getCurrentUserId();
  public assetId: string = this.route.snapshot.paramMap.get('id') ?? "";

  public assetName: BehaviorSubject<string> = new BehaviorSubject<string>("");
  public assetValue: BehaviorSubject<string> = new BehaviorSubject<string>("");

  public isLoadingTitle = false;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataService,
  ){}

  ngOnInit() {
    this.isLoadingTitle = true;
    this.dataService.getAssetById$(this.userId, this.assetId).subscribe((asset: Asset | null) => {
      this.assetName.next(asset?.assetName ?? "");
      this.assetValue.next('$' + (asset?.curValue ?? 0).toLocaleString());
      this.isLoadingTitle = false;
    });
  }

  public onBack() {
    this.router.navigate(['/overview']);
  }
}
