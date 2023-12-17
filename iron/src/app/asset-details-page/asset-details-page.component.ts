import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { ValueHistoryComponent } from '../value-history/value-history.component';
import { AuthService } from '../shared/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';  
import { BluButton } from 'projects/blueprint/src/lib/button/button.component';
import { BluModal } from 'projects/blueprint/src/lib/modal/modal.component';
import { BehaviorSubject, filter, map } from 'rxjs';
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
  public assetId: string = this.route.snapshot.paramMap.get('id') ?? "";

  public displayAssetName$: BehaviorSubject<string> = new BehaviorSubject<string>("");
  public displayAssetValue$: BehaviorSubject<string> = new BehaviorSubject<string>("");
  public asset$: BehaviorSubject<Asset> = new BehaviorSubject<Asset>({});

  public isLoadingTitle = false;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataService,
  ){}

  ngOnInit() {
    this.isLoadingTitle = true;
    this.dataService.getAssetById$(this.assetId)
    .pipe(
      filter((asset: Asset) => !!asset.assetId),
      map((asset: Asset) => {
        this.asset$.next(asset);
        this.displayAssetName$.next(this.getDisplayName(asset));
        this.displayAssetValue$.next('$' + (asset?.curValue ?? 0).toLocaleString());
        this.isLoadingTitle = false;
      })
    ).subscribe();
  }

  public onBack() {
    this.router.navigate(['/overview']);
  }

  private getDisplayName(asset: Asset): string {
    if(!asset) {
      return '';
    }
    
    if(asset.assetType) {
      return asset.assetType + ' - ' + asset.assetName ?? '';
    }

    return asset.assetName ?? ''
  }
}
