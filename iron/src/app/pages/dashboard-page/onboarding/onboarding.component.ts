import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { BluHeading } from 'projects/blueprint/src/lib/heading/heading.component';
import { BluModal } from 'projects/blueprint/src/lib/modal/modal.component';
import { BluText } from 'projects/blueprint/src/lib/text/text.component';
import { Observable, of } from 'rxjs';
import { Asset } from 'src/app/shared/constants/constants';
import { TEXTS } from './onboarding.strings';
import { BluButton } from 'projects/blueprint/src/lib/button/button.component';
import { PreferencesService, USER_PREFERENCES } from 'src/app/shared/services/preferences.service';

@Component({
  selector: 'onboarding',
  standalone: true,
  imports: [CommonModule, BluText, MatProgressBarModule, BluModal, BluHeading, BluButton],
  templateUrl: './onboarding.component.html',
  styleUrl: './onboarding.component.scss'
})
export class OnboardingComponent {
  @Input() assets$: Observable<Asset[]> = of([]);

  TEXTS = TEXTS;
  
  showFirstStep = false;
  showSecondStep = false;
  showThirdStep = false;

  showDetails = this.preferencesService.getPreference(USER_PREFERENCES.ShowOnboarding) === "true" ?? true;

  constructor(
    private preferencesService: PreferencesService,
  ){}

  ngOnInit() {
    this.assets$.subscribe((assets: Asset[]) => {
      this.showFirstStep = assets.length < 1;
      this.showSecondStep = assets.length >= 1 && assets.length < 3;
      this.showThirdStep = assets.length >= 3 && assets.length < 10;
    });
  }

  onToggleDetails(): void {
    this.showDetails = !this.showDetails;
    this.preferencesService.setPreference(USER_PREFERENCES.ShowOnboarding, this.showDetails.toString());
  }
}
