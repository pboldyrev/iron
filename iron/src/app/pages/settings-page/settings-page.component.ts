import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { BluButton } from 'projects/blueprint/src/lib/button/button.component';
import { BluHeading } from 'projects/blueprint/src/lib/heading/heading.component';
import { BluLink } from 'projects/blueprint/src/lib/link/link.component';
import { BluModal } from 'projects/blueprint/src/lib/modal/modal.component';
import { BluText } from 'projects/blueprint/src/lib/text/text.component';
import { NavigationService } from 'src/app/shared/services/navigation-service.service';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [CommonModule, BluModal, BluButton, BluHeading, BluText, BluLink, MatTabsModule, MatTableModule],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.scss'
})
export class SettingsPageComponent {
  public accounts = [];

  constructor(
    private navigationService: NavigationService,
  ){}

  public onBack(): void {
    this.navigationService.back();
  }

  public onDeleteArchivedAssets(): void {
    console.log("Deleted all assets");
  }
}
