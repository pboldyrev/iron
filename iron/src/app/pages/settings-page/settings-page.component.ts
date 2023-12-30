import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BluButton } from 'projects/blueprint/src/lib/button/button.component';
import { BluModal } from 'projects/blueprint/src/lib/modal/modal.component';
import { NavigationService } from 'src/app/shared/services/navigation-service.service';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [CommonModule, BluModal, BluButton],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.scss'
})
export class SettingsPageComponent {
  constructor(
    private navigationService: NavigationService,
  ){}

  public onBack() {
    this.navigationService.back();
  }
}
