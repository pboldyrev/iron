import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { BluButton } from 'projects/blueprint/src/lib/button/button.component';
import { TEXTS } from './dashboard-top-bar.strings';
import { ConfirmationPopupComponent } from 'src/app/shared/components/confirmation-popup/confirmation-popup.component';
import { AddAssetPopupComponent } from '../../add-asset-page/add-asset-selection/add-asset-popup/add-asset-popup.component';
import { NavigationService } from 'src/app/shared/services/navigation-service.service';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'dashboard-top-bar',
  standalone: true,
  imports: [CommonModule, BluButton, ConfirmationPopupComponent, AddAssetPopupComponent],
  templateUrl: './dashboard-top-bar.component.html',
  styleUrl: './dashboard-top-bar.component.scss'
})
export class DashboardTopBarComponent {
  @ViewChild('addAssetPopup') addAssetPopup!: AddAssetPopupComponent;

  TEXTS = TEXTS;

  constructor(
    private navigationService: NavigationService,
    private authService: AuthService,
  ){}

  onAddAsset(): void {
    this.addAssetPopup.show();
  }

  onSettings(): void {
    this.navigationService.navigate('/settings');
  }

  onLogOut(): void {
    this.authService.signOut();
  }

  onFeedback(): void {
    location.href = "mailto:feedback@finacle.app?subject=Finacle app feedback"
  }
}
