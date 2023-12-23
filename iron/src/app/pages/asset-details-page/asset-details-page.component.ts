import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { ValueHistoryComponent } from './value-history/value-history.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';  
import { BluButton } from 'projects/blueprint/src/lib/button/button.component';
import { BluModal } from 'projects/blueprint/src/lib/modal/modal.component';
import { BehaviorSubject, Observable, filter, map, mergeMap, of } from 'rxjs';
import { DataService } from '../../shared/services/data.service';
import { Asset, AssetType, AssetValue } from '../../shared/constants/constants';
import { BluSpinner } from 'projects/blueprint/src/lib/spinner/spinner.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ChartComponent } from 'src/app/chart/chart.component';
import { AssetMoreDetailsComponent } from './asset-more-details/asset-more-details.component';

@Component({
  selector: 'app-asset-details-page',
  standalone: true,
  imports: [CommonModule, ValueHistoryComponent, MatTabsModule, BluButton, BluModal, BluSpinner, MatProgressBarModule, ChartComponent, AssetMoreDetailsComponent],
  templateUrl: './asset-details-page.component.html',
  styleUrl: './asset-details-page.component.scss'
})
export class AssetDetailsPageComponent {
  public AssetType = AssetType;

  public asset$: BehaviorSubject<Asset> = new BehaviorSubject<Asset>({});
  public assetId$: BehaviorSubject<string> = new BehaviorSubject<string>("");
  public assetValues$: BehaviorSubject<AssetValue[]> = new BehaviorSubject<AssetValue[]>([]);
  public displayAssetName = "";
  public displayAssetValue = "";
  public isHistoryLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public isWorthLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dataService: DataService,
  ){}

  ngOnInit() {
    const curId: string = this.route.snapshot.paramMap.get('id') ?? "";

    this.assetId$.next(curId);
    this.fetchAssetValue(curId);
    this.fetchValueHistory(curId);
  }

  private fetchAssetValue(assetId: string): void {
    this.dataService.getAssetById$(assetId, this.isWorthLoading$).pipe(
      map((asset: Asset) => {
        this.asset$.next(asset);
        this.displayAssetName = this.getDisplayName(asset);
        this.displayAssetValue = this.getDisplayWorth(asset);
      })
    ).subscribe();
  }

  private fetchValueHistory(assetId: string): void {
    this.dataService.getAssetValues$(assetId, this.isHistoryLoading$).pipe(
      map((assetValues: AssetValue[]) => {
        this.assetValues$.next(assetValues);
      })
    ).subscribe()
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

  private getDisplayWorth(asset: Asset): string {
    return '$' + (asset?.curValue ?? 0).toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2});
  }
}
