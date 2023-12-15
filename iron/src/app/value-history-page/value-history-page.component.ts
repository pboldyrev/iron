import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ValueHistoryComponent } from '../value-history/value-history.component';
import { AuthService } from '../shared/services/auth.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { AssetValue } from '../shared/constants/constants';
import { DataService } from '../shared/services/data.service';

@Component({
  selector: 'app-value-history-page',
  standalone: true,
  imports: [CommonModule, ValueHistoryComponent],
  templateUrl: './value-history-page.component.html',
  styleUrl: './value-history-page.component.scss'
})
export class ValueHistoryPageComponent {
  public userId: string = this.authService.getCurrentUserId();
  public assetId: string = this.route.snapshot.paramMap.get('id') ?? "";

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private dataService: DataService,
    private router: Router,
  ){}

  public onSaved(values: AssetValue[]) {
    this.dataService.appendAssetHistory$(this.userId, this.assetId, values).subscribe();
    this.router.navigate(['/overview']);
  }
}
