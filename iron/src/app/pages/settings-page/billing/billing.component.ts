import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BluButton } from 'projects/blueprint/src/lib/button/button.component';
import { BluHeading } from 'projects/blueprint/src/lib/heading/heading.component';
import { BluIcon } from 'projects/blueprint/src/lib/icon/icon.component';
import { BluModal } from 'projects/blueprint/src/lib/modal/modal.component';
import { BluText } from 'projects/blueprint/src/lib/text/text.component';
import { PLAN_OPTIONS } from './billing.constants';
import { BillingOptionComponent, PlanOption } from './billing-option/billing-option.component';
import { TEXTS } from './billing.strings';
import { cloneDeep } from 'lodash';
import { BehaviorSubject } from 'rxjs';

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

  planOptions = cloneDeep(PLAN_OPTIONS);

  ngOnInit() {
    // getCurrentUserPlan returns Premium Monthly
    this.onOptionSelected(PLAN_OPTIONS[1]);
  }

  onOptionSelected(selectedOption: PlanOption): void {
    for(let i = 0; i < PLAN_OPTIONS.length; ++i) {
      let curOption = this.planOptions[i];

      if(curOption.name === selectedOption.name) {
        curOption.selected = true;
        curOption.link = "";
        curOption.tag = TEXTS.TAG_CURRENT;
      } else {
        curOption.selected = false;
        curOption.link = PLAN_OPTIONS[i].link;
        curOption.tag = PLAN_OPTIONS[i].tag;
      }

      this.planOptions[i] = curOption;
    }
  }
}
