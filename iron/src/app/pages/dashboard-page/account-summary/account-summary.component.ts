import { CommonModule } from '@angular/common';
import { AfterContentInit, AfterViewChecked, AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BluButton } from 'projects/blueprint/src/lib/button/button.component';
import { DisplayCurrencyPipe } from 'projects/blueprint/src/lib/common/pipes/display-currency.pipe';
import { BluHeading } from 'projects/blueprint/src/lib/heading/heading.component';
import { BluIcon } from 'projects/blueprint/src/lib/icon/icon.component';
import { BluModal } from 'projects/blueprint/src/lib/modal/modal.component';
import { BluText } from 'projects/blueprint/src/lib/text/text.component';
import { BehaviorSubject, Observable, combineLatest, delay, filter, skip, tap } from 'rxjs';
import { Asset, AssetType, AssetValue } from 'src/app/shared/constants/constants';
import { PreferencesService, USER_PREFERENCES } from 'src/app/shared/services/preferences.service';
import { DisplayPercentPipe } from "../../../../../projects/blueprint/src/lib/common/pipes/display-percent.pipe";
import { Chart } from 'chart.js';
import { ChartService } from 'src/app/shared/services/chart.service';

export type GroupSummary = {
  name: string,
  assetValue: number,
  percentageAssets: number,
}

@Component({
    selector: 'app-account-summary',
    standalone: true,
    templateUrl: './account-summary.component.html',
    styleUrl: './account-summary.component.scss',
    imports: [CommonModule, BluModal, MatProgressBarModule, MatTooltipModule, BluIcon, BluHeading, BluButton, DisplayCurrencyPipe, BluText, DisplayPercentPipe]
})
export class AccountSummaryComponent {
  @ViewChild('assetSummaryChart') assetSummaryChart!: Chart;
  @Input() assets$!: Observable<Asset[]>;
  @Input() renderChart$!: Observable<boolean>;
  
  showTopHoldings = this.preferencesService.getPreference(USER_PREFERENCES.ShowTopHoldings) === "true" ?? true;
  
  constructor(
    private preferencesService: PreferencesService,
    private chartService: ChartService,
  ) {}

  ngOnInit() {
    combineLatest([
      this.assets$,
      this.renderChart$
    ]).pipe(
      delay(0),
      filter(([data, renderChart]: [Asset[], boolean]) => renderChart),
      tap(([data, renderChart]: [Asset[], boolean]) => {
        let assetValues = this.getTopAssets(data);

        if(this.assetSummaryChart) {
          this.assetSummaryChart.data = this.chartService.getDataSetPie(assetValues);
          this.assetSummaryChart.update();
        } else {
          this.assetSummaryChart = new Chart('assetSummaryChart', this.chartService.getPieOptions(assetValues));
        }
      })
    ).subscribe();
  }

  private getTopAssets(assets: Asset[]): GroupSummary[] {
    let topAssets = [] as GroupSummary[];

    let totalValue = 0;
    let totalCash = 0;
    assets.forEach((asset: Asset) => {
      totalValue += asset.curTotalValue ?? 0;
      if(asset.assetType === AssetType.Cash) {
        totalCash += asset.curTotalValue ?? 0;
      }
    });

    assets.sort((a, b) => {return (b.curTotalValue ?? 0) - (a.curTotalValue ?? 0)});

    assets.forEach((asset: Asset) => {
      let newTopAsset: GroupSummary = {
        name: asset.assetName ?? '',
        assetValue: asset.curTotalValue ?? 0,
        percentageAssets: (asset.curTotalValue ?? 0)/totalValue * 100,
      }
      if(asset.assetType !== AssetType.Cash) {
        topAssets.push(newTopAsset);
      }
    });

    topAssets.push({
      name: "Cash accounts",
      assetValue: totalCash,
      percentageAssets: totalCash / totalValue * 100,
    });

    topAssets.sort((a, b) => {return (b.assetValue ?? 0) - (a.assetValue ?? 0)});

    if(topAssets.length > 5) {
      let otherAssets: GroupSummary = {
        name: "Other assets",
        assetValue: 0,
        percentageAssets: 0,
      }

      topAssets.slice(4).forEach((summary: GroupSummary) => {
        otherAssets.assetValue += summary.assetValue;
      });

      otherAssets.percentageAssets = otherAssets.assetValue / totalValue * 100;

      topAssets.push(otherAssets);
    }

    topAssets.sort((a, b) => {
      return b.assetValue - a.assetValue;
    });
    
    return topAssets.slice(0, 5);
  }

  onToggleTopHoldings(): void {
    this.showTopHoldings = !this.showTopHoldings;
    this.preferencesService.setPreference(USER_PREFERENCES.ShowTopHoldings, this.showTopHoldings.toString());
  }
}
