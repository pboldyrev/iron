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
  @ViewChild('accountSummaryChart') accountSummaryChart!: Chart;
  @ViewChild('typeSummaryChart') typeSummaryChart!: Chart;
  @Input() assets$!: Observable<Asset[]>;
  @Input() renderChart$!: Observable<boolean>;
  
  constructor(
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
        let assetSummaryChartData = this.getAssetSummaryChartData(data);
        let accountSummaryChartData = this.getAccountSummaryChartData(data);
        let typeSummaryChartData = this.getTypeSummaryChartData(data);

        if(this.assetSummaryChart) {
          this.assetSummaryChart.data = this.chartService.getDataSetPie(assetSummaryChartData);
          this.assetSummaryChart.update();
        } else {
          this.assetSummaryChart = new Chart('assetSummaryChart', this.chartService.getPieOptions(assetSummaryChartData));
        }

        if(this.accountSummaryChart) {
          this.accountSummaryChart.data = this.chartService.getDataSetPie(accountSummaryChartData);
          this.accountSummaryChart.update();
        } else {
          this.accountSummaryChart = new Chart('accountSummaryChart', this.chartService.getPieOptions(accountSummaryChartData));
        }

        if(this.typeSummaryChart) {
          this.typeSummaryChart.data = this.chartService.getDataSetPie(typeSummaryChartData);
          this.typeSummaryChart.update();
        } else {
          this.typeSummaryChart = new Chart('typeSummaryChart', this.chartService.getPieOptions(typeSummaryChartData));
        }
      })
    ).subscribe();
  }

  private getTotalCashValue(assets: Asset[]): number {
    let totalCash = 0;
    assets.forEach((asset: Asset) => {
      if(asset.assetType === AssetType.Cash) {
        totalCash += asset.curTotalValue ?? 0;
      }
    });
    return totalCash;
  }

  private getTotalValue(assets: Asset[]): number {
    let totalValue = 0;
    assets.forEach((asset: Asset) => {
      totalValue += asset.curTotalValue ?? 0;
    });
    return totalValue;
  }

  private getAssetSummaryChartData(assets: Asset[]): GroupSummary[] {
    let topAssets = [] as GroupSummary[];

    let totalValue = this.getTotalValue(assets);
    let totalCash = this.getTotalCashValue(assets);

    assets.sort((a, b) => {return (b.curTotalValue ?? 0) - (a.curTotalValue ?? 0)});
    assets.forEach((asset: Asset) => {
      if(asset.assetType === AssetType.Cash) {
        return;
      }
      topAssets.push({
        name: asset.assetName ?? '',
        assetValue: asset.curTotalValue ?? 0,
        percentageAssets: (asset.curTotalValue ?? 0)/totalValue * 100,
      });
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

    topAssets.sort((a, b) => { return b.assetValue - a.assetValue });
    
    return topAssets.slice(0, 5);
  }

  private getAccountSummaryChartData(assets: Asset[]): GroupSummary[] {
    let topAccounts = [] as GroupSummary[];

    let totalValue = this.getTotalValue(assets);

    assets.sort((a, b) => {return (b.curTotalValue ?? 0) - (a.curTotalValue ?? 0)});
    assets.forEach((asset: Asset) => {
      let existingSummary = topAccounts.find((group: GroupSummary) => group.name === asset.account);
      if(existingSummary) {
        existingSummary.assetValue += asset.curTotalValue ?? 0;
      } else {
        topAccounts.push({
          name: asset.account ?? '',
          assetValue: asset.curTotalValue ?? 0,
          percentageAssets: (asset.curTotalValue ?? 0)/totalValue * 100,
        });
      }
    });

    topAccounts.sort((a, b) => {return (b.assetValue ?? 0) - (a.assetValue ?? 0)});

    if(topAccounts.length > 5) {
      let otherAccounts: GroupSummary = {
        name: "Other accounts",
        assetValue: 0,
        percentageAssets: 0,
      }

      topAccounts.slice(4).forEach((summary: GroupSummary) => {
        otherAccounts.assetValue += summary.assetValue;
      });

      otherAccounts.percentageAssets = otherAccounts.assetValue / totalValue * 100;

      topAccounts.push(otherAccounts);
    }

    topAccounts.sort((a, b) => { return b.assetValue - a.assetValue });
    
    return topAccounts.slice(0, 5);
  }

  private getTypeSummaryChartData(assets: Asset[]): GroupSummary[] {
    let topTypes = [] as GroupSummary[];

    let totalValue = this.getTotalValue(assets);

    assets.sort((a, b) => {return (b.curTotalValue ?? 0) - (a.curTotalValue ?? 0)});
    assets.forEach((asset: Asset) => {
      let existingSummary = topTypes.find((group: GroupSummary) => group.name === this.capitalizeFirstLetter(asset.assetType));
      if(existingSummary) {
        existingSummary.assetValue += asset.curTotalValue ?? 0;
      } else {
        topTypes.push({
          name: this.capitalizeFirstLetter(asset.assetType),
          assetValue: asset.curTotalValue ?? 0,
          percentageAssets: (asset.curTotalValue ?? 0)/totalValue * 100,
        });
      }
    });

    topTypes.sort((a, b) => {return (b.assetValue ?? 0) - (a.assetValue ?? 0)});

    if(topTypes.length > 5) {
      let otherAccounts: GroupSummary = {
        name: "Other accounts",
        assetValue: 0,
        percentageAssets: 0,
      }

      topTypes.slice(4).forEach((summary: GroupSummary) => {
        otherAccounts.assetValue += summary.assetValue;
      });

      otherAccounts.percentageAssets = otherAccounts.assetValue / totalValue * 100;

      topTypes.push(otherAccounts);
    }

    topTypes.sort((a, b) => { return b.assetValue - a.assetValue });
    
    return topTypes.slice(0, 5);
  }

  private capitalizeFirstLetter(str: string | undefined) {
    if(!str) {
      return "";
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
