import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BluButton } from 'projects/blueprint/src/lib/button/button.component';
import { BluHeading } from 'projects/blueprint/src/lib/heading/heading.component';
import { BluIcon } from 'projects/blueprint/src/lib/icon/icon.component';
import { BluModal } from 'projects/blueprint/src/lib/modal/modal.component';
import { BluText } from 'projects/blueprint/src/lib/text/text.component';
import { PLAN_OPTIONS } from './billing.constants';
import { BillingOptionComponent, PlanOption } from '../../../billing-option/billing-option.component';
import { TEXTS } from './billing.strings';

@Component({
  selector: 'app-billing',
  standalone: true,
  imports: [CommonModule, BluModal, BluButton, BluHeading, BluText, BluIcon, BillingOptionComponent],
  templateUrl: './billing.component.html',
  styleUrl: './billing.component.scss'
})
export class BillingComponent {
  PLAN_OPTIONS = PLAN_OPTIONS;
  TEXTS = TEXTS;

  getPlanOptions(): PlanOption[] {
    // getCurrentUserPlan returns Premium Monthly
    const currentPlan = "Premium Monthly";

    return PLAN_OPTIONS.map((option: PlanOption) => {
      if(option.name === currentPlan) {
        option.selected = true;
      }
      return option;
    })
  }
}
