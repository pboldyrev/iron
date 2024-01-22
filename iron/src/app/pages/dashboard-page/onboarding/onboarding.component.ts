import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { BluHeading } from 'projects/blueprint/src/lib/heading/heading.component';
import { BluModal } from 'projects/blueprint/src/lib/modal/modal.component';
import { BluText } from 'projects/blueprint/src/lib/text/text.component';
import { Observable, of } from 'rxjs';
import { Asset } from 'src/app/shared/constants/constants';

@Component({
  selector: 'onboarding',
  standalone: true,
  imports: [CommonModule, BluText, MatProgressBarModule, BluModal, BluHeading],
  templateUrl: './onboarding.component.html',
  styleUrl: './onboarding.component.scss'
})
export class OnboardingComponent {
  @Input() assets$: Observable<Asset[]> = of([]);
  
  showFirstStep = false;
  showSecondStep = false;
  showThirdStep = false;

  ngOnInit() {
    this.assets$.subscribe((assets: Asset[]) => {
      this.showFirstStep = assets.length < 1;
      this.showSecondStep = assets.length >= 1 && assets.length < 3;
      this.showThirdStep = assets.length >= 3 && assets.length < 10;
    });
  }
}
