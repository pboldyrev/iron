import { CommonModule, Location } from '@angular/common';
import { AfterContentInit, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { ValueHistoryComponent } from './value-history/value-history.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';  
import { BluButton } from 'projects/blueprint/src/lib/button/button.component';
import { BluModal } from 'projects/blueprint/src/lib/modal/modal.component';
import { BehaviorSubject, Observable, Subject, filter, last, map, mergeMap, of, skip, take, takeUntil } from 'rxjs';
import { DataService } from '../../shared/services/data.service';
import { Asset, AssetType, AssetValue } from '../../shared/constants/constants';
import { BluSpinner } from 'projects/blueprint/src/lib/spinner/spinner.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AssetMoreDetailsComponent } from './asset-more-details/asset-more-details.component';
import { BluHeading } from 'projects/blueprint/src/lib/heading/heading.component';
import { BluText } from 'projects/blueprint/src/lib/text/text.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { NavigationService } from 'src/app/shared/services/navigation-service.service';
import { Chart } from 'chart.js';
import { ChartService } from 'src/app/shared/services/chart.service';
import { BluLabel } from 'projects/blueprint/src/lib/label/label.component';

@Component({
  selector: 'app-asset-details-page',
  standalone: true,
  imports: [CommonModule, ValueHistoryComponent, MatTabsModule, BluButton, BluModal, BluSpinner, MatProgressBarModule, AssetMoreDetailsComponent, BluSpinner, BluHeading, BluText, BluLabel],
  templateUrl: './asset-details-page.component.html',
  styleUrl: './asset-details-page.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class AssetDetailsPageComponent implements AfterContentInit {
  public AssetType = AssetType;

  public asset$ = new BehaviorSubject<Asset>({});
  public assetId$ = new BehaviorSubject<string>("");
  public assetValues$ = new BehaviorSubject<AssetValue[]>([]);

  public isDetailsLoading$ = new BehaviorSubject<boolean>(false);

  public displayAssetName = "";
  public displayAssetValue = "";
  historyChart: Chart | null = null;

  constructor(
    private navigationService: NavigationService,
    private route: ActivatedRoute,
    private dataService: DataService,
    private chartService: ChartService,
  ){
    const curId: string = this.navigationService.getUrlParam(this.route, 'id');
    this.assetId$.next(curId);
    this.fetchAssetValue(curId);
    this.fetchValueHistory(curId);
  }

  ngAfterContentInit() {
    this.assetValues$.pipe(
      skip(1), 
    ).subscribe((data: AssetValue[]) => {
      data = this.fillMissingData(data);
      if(this.historyChart) {
        this.historyChart.data = this.chartService.getDataSet('detailChart', data);
        this.historyChart.options.borderColor = this.chartService.getBorderColor(data);
        this.historyChart.update();
      } else {
        this.historyChart = new Chart('detailChart', this.chartService.getOptions('detailChart', data));
      }
    });
  }

  private fillMissingData(data: AssetValue[]): AssetValue[] {
    if(data.length === 0) {
      return [];
    }

    const day = 86400000;

    let filledData: AssetValue[] = [data[0]];

    for(let i = 1; i < data.length; ++i) {
      let endDate = data[i].timestamp;
      let startDate = data[i-1].timestamp;
      if(endDate - startDate > day * 365) {
        for(let d = startDate; d < endDate; d += day * 365) {
          filledData.push({
            timestamp: d,
            value: data[i-1].value,
          })
        }
      } else if(endDate - startDate > day * 30) {
        for(let d = startDate; d < endDate; d += day * 30) {
          filledData.push({
            timestamp: d,
            value: data[i-1].value,
          })
        }
      } else if(endDate - startDate > day) {
        for(let d = startDate; d < endDate; d += day) {
          filledData.push({
            timestamp: d,
            value: data[i-1].value,
          })
        }
      }
      filledData.push(data[i]);
    }

    return filledData;
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

  onBack() {
    this.navigationService.back();
  }

  onRefresh() {
    this.dataService.dataChanged$.next(true);
  }

  private getDisplayName(asset: Asset): string {
    let finalName = '';

    if(asset.assetType) {
      finalName += asset.assetType + ' - ';
    }

    if(asset.assetName) {
      finalName += asset.assetName
    }

    if(asset.nickName) {
      finalName += ' (' + asset.nickName + ')';
    }
    
    return finalName;
  }

  private getDisplayWorth(asset: Asset): string {
    return '$' + (asset?.curValue ?? 0).toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 });
  }
}
