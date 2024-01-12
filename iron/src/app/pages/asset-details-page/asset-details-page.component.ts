import { CommonModule, Location } from '@angular/common';
import { AfterContentInit, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { ValueHistoryComponent } from './value-history/value-history.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';  
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
import { BluLink } from 'projects/blueprint/src/lib/link/link.component';
import { BluInput } from 'projects/blueprint/src/lib/input/input.component';
import { FeedbackType } from 'projects/blueprint/src/lib/common/constants';
import { BluSelect } from 'projects/blueprint/src/lib/select/select.component';

@Component({
  selector: 'app-asset-details-page',
  standalone: true,
  imports: [CommonModule, ValueHistoryComponent, MatTabsModule, BluButton, BluModal, BluSpinner, MatProgressBarModule, AssetMoreDetailsComponent, BluSpinner, BluHeading, BluText, BluLabel, BluLink, BluInput, BluSelect],
  templateUrl: './asset-details-page.component.html',
  styleUrl: './asset-details-page.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class AssetDetailsPageComponent implements AfterContentInit {
  @ViewChild("appreciationRateInput") appreciationRateInput!: BluInput;
  @ViewChild("timeframeInput") timeframeInput!: BluSelect;

  AssetType = AssetType;
  FeedbackType = FeedbackType;

  asset$ = new BehaviorSubject<Asset>({});
  assetId = "";
  assetValues$ = new BehaviorSubject<AssetValue[]>([]);
  isDetailsLoading$ = new BehaviorSubject<boolean>(false);

  valueProjection = "";
  selectedTimeframe = "";
  selectedRate = "";
  
  displayAssetName = "";
  displayAssetValue = "";
  historyChart: Chart | null = null;
  projectionChart: Chart | null = null;
  showManualEntry = false;
  projectionTimeframes = ['1 year', '2 years', '3 years', '4 years', '5 years', '7 years', '10 years'];

  showValueHistory$ = this.asset$.pipe(
    take(1),
    map((asset: Asset) => asset.assetType === AssetType.Custom)
  );

  constructor(
    private navigationService: NavigationService,
    private route: ActivatedRoute,
    private dataService: DataService,
    private chartService: ChartService,
  ){
    const curId: string = this.navigationService.getUrlParam(this.route, 'id');
    this.assetId = curId;
    this.fetchAssetValue(curId);
    this.fetchValueHistory(curId);
  }

  ngAfterContentInit() {
    this.assetValues$.pipe(
      skip(1), 
    ).subscribe((data: AssetValue[]) => {
      if(this.historyChart) {
        this.historyChart.data = this.chartService.getDataSet(data);
        this.historyChart.options.borderColor = this.chartService.getBorderColor(data);
        this.historyChart.update();
      } else {
        this.historyChart = new Chart('detailChart', this.chartService.getOptions(data));
      }
    });
  }

  onTabClick(tab: MatTabChangeEvent) {
    if(tab.index === 1) {
      this.updateProjectionChart();
    }
  }

  updateProjectionChart(): void {
    if(!this.appreciationRateInput.validate() || 
        !this.timeframeInput.validate()) {
      return;
    }

    const rate = parseFloat(this.appreciationRateInput.value);
    const timeframe = this.timeframeInput.selected;
    const timeframeAsNum = parseInt(timeframe.split(' ')[0]);
    this.selectedTimeframe = timeframe;
    this.selectedRate = (rate * 100) + "%";
    this.getValueProjections$(rate, timeframeAsNum).subscribe((projections: AssetValue[]) => {
        if(this.projectionChart) {
          this.projectionChart.data = this.chartService.getDataSet(projections);
          this.projectionChart.options.borderColor = this.chartService.getBorderColor(projections);
          this.projectionChart.update();
        } else {
          this.projectionChart = new Chart('projectionChart', this.chartService.getOptions(projections));
        }
    });
  }

  private getValueProjections$(appreciationRate: number, years: number): Observable<AssetValue[]> {
    return this.assetValues$.pipe(map((assetValues: AssetValue[]) => {
      if(assetValues.length === 0) {
        return [] as AssetValue[];
      }

      let latestValue = assetValues[assetValues.length-1].totalValue;
      const latestDate = assetValues[assetValues.length-1].timestamp;

      const projection = [] as AssetValue[];
      const monthInMs = 2629800000;

      for(let i = 1; i < 12 * years; ++i) {
        latestValue = latestValue * (1-(appreciationRate/12));
        projection.push({
          timestamp: latestDate + i * monthInMs,
          totalValue: latestValue,
          units: 1
        })
      }
      this.valueProjection = latestValue.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return projection;
    }));
  }

  public onShowValueHistory(): void {
    this.showValueHistory$ = of(true);
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
    return '$' + (asset?.curTotalValue ?? 0).toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 });
  }
}
