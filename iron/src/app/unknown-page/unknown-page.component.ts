import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BluModal } from 'projects/blueprint/src/lib/modal/modal.component';
import { BluHeading } from 'projects/blueprint/src/lib/heading/heading.component';
import { BluButton } from 'projects/blueprint/src/lib/button/button.component';
import { BluText } from 'projects/blueprint/src/lib/text/text.component';
import { NavigationService } from '../shared/services/navigation-service.service';

@Component({
  selector: 'app-unknown-page',
  standalone: true,
  imports: [CommonModule, BluModal, BluHeading, BluButton, BluText],
  templateUrl: './unknown-page.component.html',
  styleUrls: ['./unknown-page.component.scss'],
})
export class UnknownPageComponent {
  constructor(private navigationService: NavigationService) {}

  onOverviewClicked(): void {
    this.navigationService.navigate('/');
  }
}
