import { Component } from '@angular/core';
import { NavigationService } from '../shared/services/navigation-service.service';
import { CommonModule } from '@angular/common';
import { BluModal } from 'projects/blueprint/src/lib/modal/modal.component';
import { BluHeading } from 'projects/blueprint/src/lib/heading/heading.component';
import { BluText } from 'projects/blueprint/src/lib/text/text.component';
import { BluButton } from 'projects/blueprint/src/lib/button/button.component';

@Component({
  selector: 'terms-conditions',
  standalone: true,
  imports: [CommonModule, BluModal, BluHeading, BluText, BluButton],
  templateUrl: './terms-conditions.component.html',
  styleUrl: './terms-conditions.component.scss'
})
export class TermsConditionsComponent {
  constructor(
    private navigationService: NavigationService,
  ){}

  public onBack(): void {
    this.navigationService.back();
  }
}
