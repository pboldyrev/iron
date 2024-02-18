import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BluHeading } from 'projects/blueprint/src/lib/heading/heading.component';
import { BluModal } from 'projects/blueprint/src/lib/modal/modal.component';
import { BluText } from 'projects/blueprint/src/lib/text/text.component';
import { NavigationService } from '../shared/services/navigation-service.service';
import { BluButton } from 'projects/blueprint/src/lib/button/button.component';

@Component({
  selector: 'privacy-policy',
  standalone: true,
  imports: [CommonModule, BluModal, BluText, BluHeading, BluButton],
  templateUrl: './privacy-policy.component.html',
  styleUrl: './privacy-policy.component.scss'
})
export class PrivacyPolicyComponent {
  constructor(
    private navigationService: NavigationService,
  ){}

  public onBack(): void {
    this.navigationService.back();
  }
}
