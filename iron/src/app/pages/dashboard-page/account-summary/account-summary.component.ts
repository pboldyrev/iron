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
import { BehaviorSubject, Observable, delay, skip } from 'rxjs';
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
  @Input() assets$!: Observable<Asset[]>;
  
  showTopHoldings = this.preferencesService.getPreference(USER_PREFERENCES.ShowTopHoldings) === "true" ?? true;
  showAccountSummary = this.preferencesService.getPreference(USER_PREFERENCES.ShowAccountSummary) === "true" ?? true;
  acountSummaries = [] as GroupSummary[];
  
  constructor(
    private preferencesService: PreferencesService,
    private chartService: ChartService,
  ) {}

  ngOnInit() {
    this.assets$.pipe(delay(0)).subscribe((data: Asset[]) => {
      let assetValues = this.getTopAssets(data);
      this.acountSummaries = this.getTopAccounts(data);

      if(this.assetSummaryChart) {
        this.assetSummaryChart.data = this.chartService.getDataSetPie(assetValues);
        this.assetSummaryChart.update();
      } else {
        this.assetSummaryChart = new Chart('assetSummaryChart', this.chartService.getPieOptions(assetValues));
      }

      if(this.accountSummaryChart) {
        this.accountSummaryChart.data = this.chartService.getDataSetPie(this.acountSummaries);
        this.accountSummaryChart.update();
      } else {
        this.accountSummaryChart = new Chart('accountSummaryChart', this.chartService.getPieOptions(this.acountSummaries));
      }
    });
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
        name: this.capitalizeFirstLetter(asset.assetType ?? '') + ' - ' + asset.assetName ?? '',
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

  private getTopAccounts(assets: Asset[]): GroupSummary[] {
    let topAccounts = [] as GroupSummary[];

    let totalValue = 0;
    assets.forEach((asset: Asset) => {
      totalValue += asset.curTotalValue ?? 0;
    });

    assets.sort((a, b) => {return (b.curTotalValue ?? 0) - (a.curTotalValue ?? 0)});

    assets.forEach((asset: Asset) => {
      let newAccountSummary: GroupSummary = {
        name: this.capitalizeFirstLetter(asset.account ?? ''),
        assetValue: 0,
        percentageAssets: 0,
      }
      let accountExists = false;
      topAccounts.forEach((account: GroupSummary) => {
        if(account.name === asset.account) {
          accountExists = true;
        }
      });

      if(!accountExists) {
        topAccounts.push(newAccountSummary);
      }
    });

    assets.forEach((asset: Asset) => {
      topAccounts.forEach((account: GroupSummary) => {
        if(account.name === asset.account) {
          account.assetValue += asset.curTotalValue ?? 0;
          account.percentageAssets = account.assetValue / totalValue * 100;
        }
      });
    });

    return topAccounts;
  }

  private capitalizeFirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  onToggleTopHoldings(): void {
    this.showTopHoldings = !this.showTopHoldings;
    this.preferencesService.setPreference(USER_PREFERENCES.ShowTopHoldings, this.showTopHoldings.toString());
  }

  onToggleAccountSummary(): void {
    this.showAccountSummary = !this.showAccountSummary;
    this.preferencesService.setPreference(USER_PREFERENCES.ShowAccountSummary, this.showAccountSummary.toString());
  }
}
