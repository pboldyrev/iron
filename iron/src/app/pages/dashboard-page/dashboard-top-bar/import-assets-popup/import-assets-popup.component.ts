import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { BluButton } from 'projects/blueprint/src/lib/button/button.component';
import { BluFileUpload } from 'projects/blueprint/src/lib/file-upload/file-upload.component';
import { BluHeading } from 'projects/blueprint/src/lib/heading/heading.component';
import { BluLink } from 'projects/blueprint/src/lib/link/link.component';
import { BluPopup } from 'projects/blueprint/src/lib/popup/popup.component';
import { BluText } from 'projects/blueprint/src/lib/text/text.component';
import { TEMPLATE } from './import-assets-popup.constants';

@Component({
  selector: 'import-assets-popup',
  standalone: true,
  imports: [CommonModule, BluPopup, BluFileUpload, BluText, BluLink, BluHeading, BluButton],
  templateUrl: './import-assets-popup.component.html',
  styleUrl: './import-assets-popup.component.scss'
})
export class ImportAssetsPopupComponent {
  @ViewChild('importAssetsPopup') importAssetsPopup!: BluPopup;

  public show(): void {
    this.importAssetsPopup.show();
  }

  public hide(): void {
    this.importAssetsPopup.hide();
  }

  onDownloadTemplate(): void {
    const newBlob = new Blob([TEMPLATE], { type: "text/csv" });
    const data = window.URL.createObjectURL(newBlob);
    const link = document.createElement("a");
    link.href = data;
    link.download = 'finacle_template';
    link.click();
  }

  onFileUploaded(fileContent: string): void {
    console.log(fileContent);
  }
}
