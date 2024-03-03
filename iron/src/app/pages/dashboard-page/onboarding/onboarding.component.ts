import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { BluHeading } from 'projects/blueprint/src/lib/heading/heading.component';
import { BluModal } from 'projects/blueprint/src/lib/modal/modal.component';
import { BluText } from 'projects/blueprint/src/lib/text/text.component';
import { Observable, filter, of } from 'rxjs';
import { Asset, AssetType } from 'src/app/shared/constants/constants';
import { TEXTS } from './onboarding.strings';
import { BluButton } from 'projects/blueprint/src/lib/button/button.component';
import {
  PreferencesService,
  USER_PREFERENCES,
} from 'src/app/shared/services/preferences.service';

@Component({
  selector: 'onboarding',
  standalone: true,
  imports: [
    CommonModule,
    BluText,
    MatProgressBarModule,
    BluModal,
    BluHeading,
    BluButton,
  ],
  templateUrl: './onboarding.component.html',
  styleUrl: './onboarding.component.scss',
})
export class OnboardingComponent {
  @Input() assets: Asset[] = [];

  TEXTS = TEXTS;

  showStep = -1;

  showDetails =
    (this.preferencesService.getPreference(USER_PREFERENCES.ShowOnboarding) ??
      'true') === 'true' ?? true;

  constructor(private preferencesService: PreferencesService) {}

  ngOnInit() {
    // if (
    //   this.preferencesService.getPreference(
    //     USER_PREFERENCES.CompletedOnboarding,
    //   ) === 'true'
    // ) {
    //   this.showStep = -1;
    //   return;
    // }

    if (this.assets.length >= 0) {
      this.showStep = 1;
    }
    if (this.assets.length >= 1) {
      this.showStep = 2;
    }
    if (this.assets.length >= 2) {
      this.showStep = 3;
    }
    if (this.assets.length >= 10) {
      this.preferencesService.setPreference(
        USER_PREFERENCES.CompletedOnboarding,
        'true',
      );
    }
  }

  onToggleDetails(): void {
    this.showDetails = !this.showDetails;
    this.preferencesService.setPreference(
      USER_PREFERENCES.ShowOnboarding,
      this.showDetails.toString(),
    );
  }
}
