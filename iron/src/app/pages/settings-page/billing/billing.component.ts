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
import { DataService } from 'src/app/shared/services/data.service';
import { LoadingStateComponent } from 'src/app/shared/components/loading-state/loading-state.component';

@Component({
  selector: 'app-billing',
  standalone: true,
  imports: [CommonModule, BluModal, BluButton, BluHeading, BluText, BluIcon, BillingOptionComponent, LoadingStateComponent],
  templateUrl: './billing.component.html',
  styleUrl: './billing.component.scss'
})
export class BillingComponent {
  PLAN_OPTIONS = PLAN_OPTIONS;
  TEXTS = TEXTS;

  planOptions = cloneDeep(PLAN_OPTIONS);

  isLoading = false;

  constructor(
    private dataService: DataService,
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.dataService.getUser$().subscribe((data: any) => {
      if(data.user.plan === "free") {
        this.planOptions[0].selected = true;
        this.planOptions[0].canSelect = false;
      } else if(data.user.plan === "monthly") {
        this.planOptions[1].selected = true;
        this.planOptions[1].canSelect = false;
      } else if(data.user.plan === "annually") {
        this.planOptions[2].selected = true;
        this.planOptions[2].canSelect = false;
        this.planOptions[1].canSelect = false;
      }
      this.isLoading = false;
    });
  }

  onOptionSelected(selectedOption: PlanOption): void {
    this.dataService.createStripeCheckoutSession$(selectedOption.name).subscribe((data: any) => {
      location.href = data.url;
    });
  }
}
