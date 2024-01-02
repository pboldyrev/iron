import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { BluButton } from 'projects/blueprint/src/lib/button/button.component';
import { FeedbackType } from 'projects/blueprint/src/lib/common/constants';
import { BluHeading } from 'projects/blueprint/src/lib/heading/heading.component';
import { BluLink } from 'projects/blueprint/src/lib/link/link.component';
import { BluModal } from 'projects/blueprint/src/lib/modal/modal.component';
import { BluText } from 'projects/blueprint/src/lib/text/text.component';
import { ConfirmationPopupComponent } from 'src/app/shared/components/confirmation-popup/confirmation-popup.component';
import { DataService } from 'src/app/shared/services/data.service';
import { NavigationService } from 'src/app/shared/services/navigation-service.service';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [CommonModule, BluModal, BluButton, BluHeading, BluText, BluLink, MatTabsModule, MatTableModule, ConfirmationPopupComponent],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.scss'
})
export class SettingsPageComponent {
  public accounts = [];

  constructor(
    private navigationService: NavigationService,
    private dataService: DataService,
    private toastService: ToastService,
  ){}

  public onBack(): void {
    this.navigationService.back();
  }

  public onDeleteArchivedAssets(): void {
    this.dataService.deleteArchivedAssets$()
    .subscribe({
      next: () => {
        this.toastService.showToast("All archived assets have been deleted.", FeedbackType.SUCCESS);
      },
      error: () => {
        this.toastService.showToast("There was an issue deleting the assets. Please try again later.", FeedbackType.ERROR);
      }
    });
  }
}
