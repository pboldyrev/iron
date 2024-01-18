import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BluButton } from 'projects/blueprint/src/lib/button/button.component';
import { BluHeading } from 'projects/blueprint/src/lib/heading/heading.component';
import { BluLabel } from 'projects/blueprint/src/lib/label/label.component';
import { BluModal } from 'projects/blueprint/src/lib/modal/modal.component';
import { BluTag } from 'projects/blueprint/src/lib/tag/tag.component';
import { BluText } from 'projects/blueprint/src/lib/text/text.component';
import { Asset, AssetType } from 'src/app/shared/constants/constants';
import { ASSETS_TO_QUALIFY } from './ai-feedback.constants';
import { BluLink } from 'projects/blueprint/src/lib/link/link.component';
import { BluPopup } from 'projects/blueprint/src/lib/popup/popup.component';
import { PreferencesService, USER_PREFERENCES } from 'src/app/shared/services/preferences.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-ai-feedback',
  standalone: true,
  imports: [CommonModule, BluModal, BluLink, BluButton, BluText, BluLabel, BluHeading, BluTag, MatProgressSpinnerModule, BluPopup, MatProgressBarModule],
  templateUrl: './ai-feedback.component.html',
  styleUrl: './ai-feedback.component.scss'
})
export class AiFeedbackComponent {
  @ViewChild("legalDisclaimer") legalDisclaimer!: BluPopup;
  @Input() assets$ = new BehaviorSubject<Asset[]>([]);

  ASSETS_TO_QUALIFY = ASSETS_TO_QUALIFY;

  showDetails = this.preferencesService.getPreference(USER_PREFERENCES.ShowPortfolioFeedbackDetails) === "true" ?? true;
  numQualifyingAssets = 0;
  shouldQualify = this.numQualifyingAssets >= ASSETS_TO_QUALIFY;

  constructor(
    private preferencesService: PreferencesService,
  ) {}

  ngOnInit() {
    this.assets$.subscribe((assets: Asset[]) => {
      let numAssets = 0;

      assets.forEach((asset: Asset) => {
        if(asset.assetType !== AssetType.Cash) {
          numAssets++;
        }
      });
  
      this.numQualifyingAssets = numAssets >= ASSETS_TO_QUALIFY ? ASSETS_TO_QUALIFY : numAssets;
    });
  }

  onShowLegalDisclaimer(): void {
    this.legalDisclaimer.show();
  }

  onToggleDetails(): void {
    let newPreference = !this.showDetails;
    this.showDetails = newPreference;
    this.preferencesService.setPreference(USER_PREFERENCES.ShowPortfolioFeedbackDetails, newPreference.toString());
  }

  onGetFeedback(): void {
    alert("This hasn't been implemented yet!");
  }
}
