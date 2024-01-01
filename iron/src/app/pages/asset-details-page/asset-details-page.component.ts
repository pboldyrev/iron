import { CommonModule, Location } from '@angular/common';
import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { ValueHistoryComponent } from './value-history/value-history.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';  
import { BluButton } from 'projects/blueprint/src/lib/button/button.component';
import { BluModal } from 'projects/blueprint/src/lib/modal/modal.component';
import { BehaviorSubject, Observable, Subject, filter, map, mergeMap, of, takeUntil } from 'rxjs';
import { DataService } from '../../shared/services/data.service';
import { Asset, AssetType, AssetValue } from '../../shared/constants/constants';
import { BluSpinner } from 'projects/blueprint/src/lib/spinner/spinner.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ChartComponent } from 'src/app/shared/components/chart/chart.component';
import { AssetMoreDetailsComponent } from './asset-more-details/asset-more-details.component';
import { BluHeading } from 'projects/blueprint/src/lib/heading/heading.component';
import { BluText } from 'projects/blueprint/src/lib/text/text.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { NavigationService } from 'src/app/shared/services/navigation-service.service';

@Component({
  selector: 'app-asset-details-page',
  standalone: true,
  imports: [CommonModule, ValueHistoryComponent, MatTabsModule, BluButton, BluModal, BluSpinner, MatProgressBarModule, ChartComponent, AssetMoreDetailsComponent, BluSpinner, BluHeading, BluText],
  templateUrl: './asset-details-page.component.html',
  styleUrl: './asset-details-page.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class AssetDetailsPageComponent {
  public AssetType = AssetType;

  public asset$ = new BehaviorSubject<Asset>({});
  public assetId$ = new BehaviorSubject<string>("");
  public assetValues$ = new BehaviorSubject<AssetValue[]>([]);

  public isDetailsLoading$ = new BehaviorSubject<boolean>(false);

  public displayAssetName = "";
  public displayAssetValue = "";

  constructor(
    private navigationService: NavigationService,
    private route: ActivatedRoute,
    private dataService: DataService,
  ){
    const curId: string = this.navigationService.getUrlParam(this.route, 'id');
    this.assetId$.next(curId);
    this.fetchAssetValue(curId);
    this.fetchValueHistory(curId);
  }

  private fetchAssetValue(assetId: string): void {
    this.dataService.getAssetById$(assetId, this.isDetailsLoading$).pipe(
      takeUntilDestroyed(),
      map((asset: Asset) => {
        this.asset$.next(asset);
        this.displayAssetName = this.getDisplayName(asset);
        this.displayAssetValue = this.getDisplayWorth(asset);
      })
    ).subscribe();
  }

  private fetchValueHistory(assetId: string): void {
    this.dataService.getAssetValues$(assetId, this.isDetailsLoading$).pipe(
      takeUntilDestroyed(),
      map((assetValues: AssetValue[]) => {
        this.assetValues$.next(assetValues);
      })
    ).subscribe()
  }

  public onBack() {
    this.navigationService.back();
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
    return '$' + (asset?.curValue ?? 0).toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 });
  }
}
