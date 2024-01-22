import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BluButton } from 'projects/blueprint/src/lib/button/button.component';
import { BluHeading } from 'projects/blueprint/src/lib/heading/heading.component';
import { BluIcon } from 'projects/blueprint/src/lib/icon/icon.component';
import { BluModal } from 'projects/blueprint/src/lib/modal/modal.component';
import { BluText } from 'projects/blueprint/src/lib/text/text.component';
import { TEXTS } from './billing-option.strings';
import { NavigationService } from 'src/app/shared/services/navigation-service.service';
import { BluTag } from 'projects/blueprint/src/lib/tag/tag.component';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { PlanName, PlanNameToDisplay } from '../billing.constants';
import { BluSpinner } from 'projects/blueprint/src/lib/spinner/spinner.component';

export type PlanOption = {
  name: PlanName,
  price: string,
  canSelect: boolean,
  benefits: string[],
  selected: boolean,
  tag: string,
}

@Component({
  selector: 'app-billing-option',
  standalone: true,
  imports: [CommonModule, BluModal, BluHeading, BluText, BluButton, BluIcon, BluTag, BluSpinner],
  templateUrl: './billing-option.component.html',
  styleUrl: './billing-option.component.scss'
})
export class BillingOptionComponent {
  @Input() plan!: PlanOption;
  @Output() optionSelected = new EventEmitter();

  TEXTS = TEXTS;
  PlanNameToDisplay = PlanNameToDisplay;

  isLoading = false;

  onUpgradeClicked(): void {
    this.isLoading = true;
    this.optionSelected.emit();
  }
}
