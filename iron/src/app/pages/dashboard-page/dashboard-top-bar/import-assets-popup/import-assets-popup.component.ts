import { CommonModule } from '@angular/common';
import { Component, Sanitizer, ViewChild } from '@angular/core';
import { BluButton } from 'projects/blueprint/src/lib/button/button.component';
import { BluFileUpload } from 'projects/blueprint/src/lib/file-upload/file-upload.component';
import { BluHeading } from 'projects/blueprint/src/lib/heading/heading.component';
import { BluLink } from 'projects/blueprint/src/lib/link/link.component';
import { BluPopup } from 'projects/blueprint/src/lib/popup/popup.component';
import { BluText } from 'projects/blueprint/src/lib/text/text.component';
import { TEMPLATE } from './import-assets-popup.constants';
import { Asset, AssetType } from 'src/app/shared/constants/constants';
import { Papa } from 'ngx-papaparse';
import { BluModal } from 'projects/blueprint/src/lib/modal/modal.component';
import { DisplayDatePipe } from "../../../../../../projects/blueprint/src/lib/common/pipes/display-date.pipe";
import { SYMBOLS } from 'src/assets/data/valid_symbols';

@Component({
    selector: 'import-assets-popup',
    standalone: true,
    templateUrl: './import-assets-popup.component.html',
    styleUrl: './import-assets-popup.component.scss',
    imports: [CommonModule, BluModal, BluPopup, BluFileUpload, BluText, BluLink, BluHeading, BluButton, DisplayDatePipe]
})
export class ImportAssetsPopupComponent {
  @ViewChild('importAssetsPopup') importAssetsPopup!: BluPopup;

  AssetType = AssetType;

  showConfirm = false;
  uploadComplete = false;
  curRow = 1;
  
  extractedAssets = [] as { asset: Asset, errors: string[] }[];
  
  constructor(
    private papa: Papa,
  ){}

  public show(): void {
    this.importAssetsPopup.show();
  }

  public hide(): void {
    this.importAssetsPopup.hide();
    this.reset();
  }

  private reset(): void {
    this.showConfirm = false;
    this.uploadComplete = false;
    this.curRow = 1;
    this.extractedAssets = [];
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
    let data = this.papa.parse(fileContent);

    // Remove header rows
    data.data.shift();

    data.data.forEach((row: any) => {
      let errors = [] as string[];
      let extractedAsset = {} as Asset;
      extractedAsset.assetType = this.getAssetType(row, errors);
      extractedAsset.account = this.getAccount(row, errors);
      extractedAsset.initTimestamp = this.getDate(row, errors);

      if(extractedAsset.assetType === AssetType.Stock) {
        extractedAsset.ticker = this.getTicker(row, errors);
        extractedAsset.initUnits = this.getInitialShares(row, errors);
      }

      this.extractedAssets.push({
        asset: extractedAsset,
        errors: errors,
      });
      this.curRow++;
    });

    this.showConfirm = true;
  }

  private getAssetType(row: any, errors: string[]): AssetType | undefined {
    let rawType = row[0] as string;
    rawType = rawType.trim().toLowerCase();
    
    if(rawType.includes(AssetType.Cash)) {
      return AssetType.Cash;
    } 
    if(rawType.includes(AssetType.Stock)) {
      return AssetType.Stock;
    } 
    if(rawType.includes(AssetType.Vehicle)) {
      return AssetType.Vehicle;
    }
    
    errors.push("Could not parse asset type: " + rawType); 
    return undefined;
  }

  private getAccount(row: any, errors: string[]): string {
    return row[1];
  }

  private getDate(row: any, errors: string[]): number | undefined {
    let rawDate = row[2];
    let dateObj = new Date(rawDate);

    if(dateObj instanceof Date && !isNaN(dateObj.valueOf())) {
      return new Date(dateObj).valueOf();
    }

    errors.push("Could not parse date: " + rawDate);
    return undefined;
  }

  private getTicker(row: any, errors: string[]): string | undefined {
    let ticker = (row[3] as string).trim().toUpperCase();

    if(SYMBOLS.includes(ticker)) {
      return ticker;
    }

    errors.push("Could not parse ticker: " + ticker);
    return undefined;
  }

  private getInitialShares(row: any, errors: string[]): number | undefined {
    let rawShares = (row[4] as string).trim();

    if(parseInt(rawShares)) {
      return parseInt(rawShares);
    }

    errors.push("Could not parse number of shares: " + rawShares);
    return undefined;
  }
}
