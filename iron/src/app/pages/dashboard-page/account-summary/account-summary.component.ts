import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BluButton } from 'projects/blueprint/src/lib/button/button.component';
import { DisplayCurrencyPipe } from 'projects/blueprint/src/lib/common/pipes/display-currency.pipe';
import { BluHeading } from 'projects/blueprint/src/lib/heading/heading.component';
import { BluIcon } from 'projects/blueprint/src/lib/icon/icon.component';
import { BluModal } from 'projects/blueprint/src/lib/modal/modal.component';
import { BluText } from 'projects/blueprint/src/lib/text/text.component';
import { BehaviorSubject } from 'rxjs';
import { Asset } from 'src/app/shared/constants/constants';
import { PreferencesService, USER_PREFERENCES } from 'src/app/shared/services/preferences.service';
import { DisplayPercentPipe } from "../../../../../projects/blueprint/src/lib/common/pipes/display-percent.pipe";

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
  @Input() assets$ = new BehaviorSubject<Asset[]>([]);
  
  showAccountDetails = this.preferencesService.getPreference(USER_PREFERENCES.ShowAccountSummaryDetails) === "true" ?? true;
  showTypeDetails = this.preferencesService.getPreference(USER_PREFERENCES.ShowTypeSummaryDetails) === "true" ?? true;
  acountSummaries = [] as GroupSummary[];
  topAssets = [] as GroupSummary[];
  
  constructor(
    private preferencesService: PreferencesService,
  ) {}

  ngOnInit() {
    this.assets$.subscribe((assets: Asset[]) => {
      this.updateValues(assets);
    });
  }

  private updateValues(assets: Asset[]) {
    this.acountSummaries = [];
    this.topAssets = [];
      
    let accountNames = [] as string[];
    let totalValue = 0;

    assets.forEach((asset: Asset) => {
      if(!accountNames.includes(asset.account ?? '')) {
        accountNames.push(asset.account ?? '');
      }
      totalValue += asset.curTotalValue ?? 0;
    });

    accountNames.forEach((accountName: string) => {
      let newAccountSummary: GroupSummary = {
        name: accountName,
        assetValue: 0,
        percentageAssets: 0,
      }

      assets.forEach((asset: Asset) => {
        if(asset.account === accountName) {
          newAccountSummary.assetValue += (asset.curTotalValue ?? 0);
        }
      });

      newAccountSummary.percentageAssets = (newAccountSummary.assetValue / totalValue) * 100;

      this.acountSummaries.push(newAccountSummary);
      this.acountSummaries.sort((a, b) => b.assetValue - a.assetValue);
    });

    assets.sort((a, b) => {return (b.curTotalValue ?? 0) - (a.curTotalValue ?? 0)});

    assets.forEach((asset: Asset) => {
      if(this.topAssets.length < 5) {
        let newTopAsset: GroupSummary = {
          name: asset.assetType + ' - ' + asset.assetName ?? '',
          assetValue: asset.curTotalValue ?? 0,
          percentageAssets: (asset.curTotalValue ?? 0)/totalValue * 100,
        }
        this.topAssets.push(newTopAsset);
      }
    });
  }

  onToggleAccountDetails(): void {
    this.showAccountDetails = !this.showAccountDetails;
    this.preferencesService.setPreference(USER_PREFERENCES.ShowAccountSummaryDetails, this.showAccountDetails.toString());
  }

  onTogglTypeDetails(): void {
    this.showTypeDetails = !this.showTypeDetails;
    this.preferencesService.setPreference(USER_PREFERENCES.ShowTypeSummaryDetails, this.showTypeDetails.toString());
  }
}
