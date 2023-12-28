import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { BluPopup } from 'projects/blueprint/src/lib/popup/popup.component';
import { AddAssetSelectionComponent } from '../add-asset-selection/add-asset-selection.component';

@Component({
  selector: 'app-add-asset-popup',
  standalone: true,
  imports: [CommonModule, BluPopup, AddAssetSelectionComponent],
  templateUrl: './add-asset-popup.component.html',
  styleUrl: './add-asset-popup.component.scss'
})
export class AddAssetPopupComponent {
  @ViewChild('addAssetPopup') addAssetPopup!: BluPopup;

  public show() {
    this.addAssetPopup.show();
  }

  public hide() {
    this.addAssetPopup.hide();
  }
}
