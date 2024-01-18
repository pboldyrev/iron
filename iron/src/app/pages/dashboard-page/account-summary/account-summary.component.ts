import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { BluButton } from 'projects/blueprint/src/lib/button/button.component';
import { DisplayCurrencyPipe } from 'projects/blueprint/src/lib/common/pipes/display-currency.pipe';
import { BluHeading } from 'projects/blueprint/src/lib/heading/heading.component';
import { BluModal } from 'projects/blueprint/src/lib/modal/modal.component';
import { BluText } from 'projects/blueprint/src/lib/text/text.component';
import { Asset } from 'src/app/shared/constants/constants';
import { PreferencesService, USER_PREFERENCES } from 'src/app/shared/services/preferences.service';

export type AccountSummary = {
  name: string,
  assetValue: number,
  percentageAssets: number,
}

@Component({
  selector: 'app-account-summary',
  standalone: true,
  imports: [CommonModule, BluModal, MatProgressBarModule, BluHeading, BluButton, DisplayCurrencyPipe, BluText],
  templateUrl: './account-summary.component.html',
  styleUrl: './account-summary.component.scss'
})
export class AccountSummaryComponent {
  @Input() assets = [] as Asset[];
  
  showDetails = this.preferencesService.getPreference(USER_PREFERENCES.ShowAccountSummaryDetails) === "true" ?? true;
  acountSummaries = [] as AccountSummary[];
  
  constructor(
    private preferencesService: PreferencesService,
  ) {}

  ngOnInit() {
    let accountNames = [] as string[];
    let totalValue = 0;
    this.assets.forEach((asset: Asset) => {
      if(!accountNames.includes(asset.account ?? '')) {
        accountNames.push(asset.account ?? '');
      }
      totalValue += asset.curTotalValue ?? 0;
    });

    accountNames.forEach((accountName: string) => {
      let newAccountSummary: AccountSummary = {
        name: accountName,
        assetValue: 0,
        percentageAssets: 0,
      }

      this.assets.forEach((asset: Asset) => {
        if(asset.account === accountName) {
          newAccountSummary.assetValue += (asset.curTotalValue ?? 0);
        }
      });

      newAccountSummary.percentageAssets = (newAccountSummary.assetValue / totalValue) * 100;

      this.acountSummaries.push(newAccountSummary);
      this.acountSummaries.sort((a, b) => b.assetValue - a.assetValue);
    });
  }

  onToggleDetails(): void {
    let newPreference = !this.showDetails;
    this.showDetails = newPreference;
    this.preferencesService.setPreference(USER_PREFERENCES.ShowAccountSummaryDetails, newPreference.toString());
  }
}
