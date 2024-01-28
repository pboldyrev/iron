import { CommonModule } from '@angular/common';
import { Component, Sanitizer, ViewChild } from '@angular/core';
import { BluButton } from 'projects/blueprint/src/lib/button/button.component';
import { BluFileUpload } from 'projects/blueprint/src/lib/file-upload/file-upload.component';
import { BluHeading } from 'projects/blueprint/src/lib/heading/heading.component';
import { BluLink } from 'projects/blueprint/src/lib/link/link.component';
import { BluPopup } from 'projects/blueprint/src/lib/popup/popup.component';
import { BluText } from 'projects/blueprint/src/lib/text/text.component';
import { TEMPLATE } from './import-assets-popup.constants';
import { Asset, AssetType, REGEX } from 'src/app/shared/constants/constants';
import { Papa } from 'ngx-papaparse';
import { BluModal } from 'projects/blueprint/src/lib/modal/modal.component';
import { DisplayDatePipe } from "../../../../../../projects/blueprint/src/lib/common/pipes/display-date.pipe";
import { SYMBOLS } from 'src/assets/data/valid_symbols';
import { RegexService } from 'src/app/shared/services/regex.service';
import { BehaviorSubject, Observable, combineLatest, concat, map, merge, take, tap, toArray } from 'rxjs';
import { DataService } from 'src/app/shared/services/data.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { FeedbackType } from 'projects/blueprint/src/lib/common/constants';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DisplayPercentPipe } from "../../../../../../projects/blueprint/src/lib/common/pipes/display-percent.pipe";

@Component({
    selector: 'import-assets-popup',
    standalone: true,
    templateUrl: './import-assets-popup.component.html',
    styleUrl: './import-assets-popup.component.scss',
    imports: [CommonModule, MatProgressBarModule, BluModal, BluPopup, BluFileUpload, BluText, BluLink, BluHeading, BluButton, DisplayDatePipe, DisplayPercentPipe]
})
export class ImportAssetsPopupComponent {
  @ViewChild('importAssetsPopup') importAssetsPopup!: BluPopup;

  AssetType = AssetType;

  showConfirm = false;
  showUpload = false;
  curRow = 1;
  hasErrors = false;
  isImportLoading = false;
  importObservables$ = [] as BehaviorSubject<boolean>[];
  
  extractedAssets = [] as { asset: Asset, errors: string[] }[];
  
  constructor(
    private papa: Papa,
    private regexService: RegexService,
    private dataService: DataService,
    private toastService: ToastService,
  ){}

  getTotalImported$(): Observable<number> {
    return combineLatest(this.importObservables$).pipe(
      take(1),
      map((observables: boolean[]) => {
        return observables.length;
      }),
    )
  }

  getSuccessfulImports$(): Observable<number> {
    return combineLatest(this.importObservables$).pipe(
      map((observables: boolean[]) => {
        let num = 0;
        observables.forEach((obs: boolean) => {
          if(!obs) {
            num++;
          }
        });
        return num;
      }),
    )
  }

  public show(): void {
    this.importAssetsPopup.show();
  }

  public reset(): void {
    this.showConfirm = false;
    this.showUpload = false;
    this.curRow = 1;
    this.extractedAssets = [];
    this.hasErrors = false;
  }

  onDownloadTemplate(): void {
    const newBlob = new Blob([TEMPLATE], { type: "text/csv" });
    const data = window.URL.createObjectURL(newBlob);
    const link = document.createElement("a");
    link.href = data;
    link.download = 'finacle_template';
    link.click();
  }

  onCompleteImport(): void {
    this.showUpload = true;

    if(!this.extractedAssets || this.extractedAssets.length === 0) {
      this.reset();
      this.importAssetsPopup.hide();
      return;
    }

    this.isImportLoading = true;
    this.dataService.putAssets$(this.extractedAssets.map(asset => asset.asset), this.importObservables$).subscribe(
      {
        next: () => {
          this.toastService.showToast("Successfully imported " + this.extractedAssets.length + " assets!", FeedbackType.SUCCESS);
          this.reset();
          this.isImportLoading = false;
          this.importAssetsPopup.hide();
        },
        error: () => {
          this.isImportLoading = false;
        }
      }
    );
  }

  private batchAndExecute(assetsToImport$: Observable<any>[]): void {
    const batchSize = 10;
    const groupedResponses: Observable<string>[][] = [];

    while(assetsToImport$.length) {
      groupedResponses.push(assetsToImport$.splice(0, batchSize));
    }
    
    concat(
      ...groupedResponses.map((group) => merge(...group))
    ).pipe(
      take(1),
      toArray(),
      tap({
        error: () => {
          this.toastService.showToast("There was an issue with importing your assets.", FeedbackType.ERROR);
        },
        next: () => {
          this.isImportLoading = false;
          this.dataService.dataChanged$.next(true);
          this.reset();
        }
      })
    ).subscribe();
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

      if(extractedAsset.assetType === AssetType.Vehicle) {
        extractedAsset.initTotalValue = this.getPurchasePrice(row, errors);
        extractedAsset.mileage = this.getMileage(row, errors);
        extractedAsset.vin = this.getVIN(row, errors);
        extractedAsset.nickName = this.getNickname(row, errors);
      }

      if(extractedAsset.assetType === AssetType.Cash) {
        extractedAsset.assetName = this.getCashAccountName(row, errors);
        extractedAsset.initTotalValue = this.getCurrentValue(row, errors);
        extractedAsset.appreciationRate = this.getAPY(row, errors);
      }

      if(errors.length > 0) {
        this.hasErrors = true;
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

    if(this.regexService.isValidString(rawShares, "NUMBER")) {
      return parseFloat(rawShares);
    }

    errors.push("Could not parse number of shares: " + rawShares);
    return undefined;
  }

  private getPurchasePrice(row: any, errors: string[]): number | undefined {
    let rawPrice = (row[5] as string).trim();

    if(this.regexService.isValidString(rawPrice, "NUMBER")) {
      return parseFloat(rawPrice);
    }

    errors.push("Could not parse purchase price: " + rawPrice);
    return undefined;
  }

  private getMileage(row: any, errors: string[]): number | undefined {
    let rawMileage = (row[6] as string).trim();

    if(this.regexService.isValidString(rawMileage, "INTEGER")) {
      return parseInt(rawMileage);
    }

    errors.push("Could not parse mileage: " + rawMileage);
    return undefined;
  }

  private getVIN(row: any, errors: string[]): string | undefined {
    let rawVIN = (row[7] as string).trim().toUpperCase();

    if(this.regexService.isValidString(rawVIN, "VIN")) {
      return rawVIN;
    }

    errors.push("This VIN is invalid: " + rawVIN);
    return undefined;
  }

  private getNickname(row: any, errors: string[]): string {
    let rawNickname = (row[8] as string).trim();

    return rawNickname;
  }

  private getCashAccountName(row: any, errors: string[]): string {
    let rawCashName = (row[9] as string).trim();

    return rawCashName;
  }

  private getCurrentValue(row: any, errors: string[]): number | undefined {
    let rawCashValue = (row[10] as string).trim();
    
    if(this.regexService.isValidString(rawCashValue, "NUMBER")) {
      return parseFloat(rawCashValue);
    }

    errors.push("Could not parse current value: " + rawCashValue);
    return undefined;
  }

  private getAPY(row: any, errors: string[]): number | undefined {
    let rawAPY = (row[11] as string).trim();
    
    if(this.regexService.isValidString(rawAPY, "NUMBER")) {
      return parseFloat(rawAPY);
    }

    errors.push("Could not parse APY: " + rawAPY);
    return undefined;
  }
}
