import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { BluPopup } from 'projects/blueprint/src/lib/popup/popup.component';
import { AddAssetComponent } from '../add-asset/add-asset.component';

@Component({
  selector: 'app-add-asset-popup',
  standalone: true,
  imports: [CommonModule, BluPopup, AddAssetComponent],
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
