import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { BluButton } from 'projects/blueprint/src/lib/button/button.component';
import { BluHeading } from 'projects/blueprint/src/lib/heading/heading.component';
import { BluIcon } from 'projects/blueprint/src/lib/icon/icon.component';
import { BluModal } from 'projects/blueprint/src/lib/modal/modal.component';
import { BluText } from 'projects/blueprint/src/lib/text/text.component';
import { TEXTS } from './billing-option.strings';
import { NavigationService } from 'src/app/shared/services/navigation-service.service';

export type PlanOption = {
  name: string,
  price: string,
  link: string,
  benefits: string[],
  selected: boolean,
}

@Component({
  selector: 'app-billing-option',
  standalone: true,
  imports: [CommonModule, BluModal, BluHeading, BluText, BluButton, BluIcon],
  templateUrl: './billing-option.component.html',
  styleUrl: './billing-option.component.scss'
})
export class BillingOptionComponent {
  @Input() plan!: PlanOption;

  TEXTS = TEXTS;

  constructor(
    private navigationService: NavigationService,
  ){}

  onUpgradeClicked(link: string): void {
    this.navigationService.navigate(link);
  }
}
