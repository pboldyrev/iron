import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { ValueHistoryComponent } from './value-history/value-history.component';
import { AuthService } from '../../shared/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';  
import { BluButton } from 'projects/blueprint/src/lib/button/button.component';
import { BluModal } from 'projects/blueprint/src/lib/modal/modal.component';
import { BehaviorSubject, Observable, filter, map, mergeMap } from 'rxjs';
import { DataService } from '../../shared/services/data.service';
import { Asset, AssetType } from '../../shared/constants/constants';
import { BluSpinner } from 'projects/blueprint/src/lib/spinner/spinner.component';
import { ValueHistoryChartComponent } from './value-history-chart/value-history-chart.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-asset-details-page',
  standalone: true,
  imports: [CommonModule, ValueHistoryComponent, MatTabsModule, BluButton, BluModal, BluSpinner, ValueHistoryChartComponent, MatProgressBarModule],
  templateUrl: './asset-details-page.component.html',
  styleUrl: './asset-details-page.component.scss'
})
export class AssetDetailsPageComponent {
  public assetId: string = this.route.snapshot.paramMap.get('id') ?? "";

  public displayAssetName$: BehaviorSubject<string> = new BehaviorSubject<string>("");
  public displayAssetValue$: BehaviorSubject<string> = new BehaviorSubject<string>("");
  public asset$: BehaviorSubject<Asset> = new BehaviorSubject<Asset>({});

  public isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public AssetType = AssetType;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataService,
  ){}

  private fetchAsset$(): Observable<void> {
    return this.dataService.getAssetById$(this.assetId, this.isLoading$).pipe(
      map((asset: Asset) => {
        this.asset$.next(asset);
        this.displayAssetName$.next(this.getDisplayName(asset));
        this.displayAssetValue$.next('$' + (asset?.curValue ?? 0).toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}));
      })
    )
  }

  ngOnInit() {
    this.fetchAsset$().subscribe()
    this.dataService.dataChanged$.pipe(
      mergeMap(() => {
        return this.fetchAsset$();
      })
    ).subscribe();
  }

  public onBack() {
    this.router.navigate(['/dashboard']);
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
