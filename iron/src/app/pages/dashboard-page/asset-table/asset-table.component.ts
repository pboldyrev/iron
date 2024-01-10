import { Component, Input, Output, ViewChild } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatMenuModule } from '@angular/material/menu';
import { Asset } from '../../../shared/constants/constants';
import { BluIcon } from 'projects/blueprint/src/lib/icon/icon.component';
import { BluText } from 'projects/blueprint/src/lib/text/text.component';
import { BluButton } from 'projects/blueprint/src/lib/button/button.component';
import { BehaviorSubject, Observable, combineLatest, filter, map, merge, mergeMap, of, take, tap } from 'rxjs';
import { DataService } from '../../../shared/services/data.service';
import { CommonModule } from '@angular/common';
import { TEXTS } from './asset-table.strings';
import { BluTag } from 'projects/blueprint/src/lib/tag/tag.component';
import { ConfirmationPopupComponent } from '../../../shared/components/confirmation-popup/confirmation-popup.component';
import { Router } from '@angular/router';
import { BluValidationFeedback } from 'projects/blueprint/src/lib/validation-popup/validation-feedback.component';
import { FeedbackType } from 'projects/blueprint/src/lib/common/constants';
import { BluLink } from 'projects/blueprint/src/lib/link/link.component';
import { AddAssetPopupComponent } from '../../../add-asset-selection/add-asset-popup/add-asset-popup.component';
import { ToastService } from '../../../shared/services/toast.service';
import { NavigationService } from '../../../shared/services/navigation-service.service';

export type AssetTableColumn = 
  "account" | 
  "type" | 
  "asset" | 
  "units" | 
  "initValue" | 
  "curValue" | 
  "edit" | 
  "change";

@Component({
  selector: 'app-asset-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule, 
    BluIcon,
    BluText,
    BluButton,
    MatProgressBarModule,
    BluTag,
    MatMenuModule,
    ConfirmationPopupComponent,
    BluValidationFeedback,
    BluLink,
    AddAssetPopupComponent,
  ],
  templateUrl: './asset-table.component.html',
  styleUrl: './asset-table.component.scss'
})

export class AssetTableComponent {
  @ViewChild('deleteConfirmPopup') deleteConfirmPopup!: ConfirmationPopupComponent;
  @ViewChild('addAssetPopup') addAssetPopup!: AddAssetPopupComponent;

  @Input() columns!: AssetTableColumn[];
  @Input() assets$!: BehaviorSubject<Asset[]>;
  @Input() loadingIndicator$!: BehaviorSubject<boolean>

  public curTotal: number = 0;
  public initTotal: number = 0;

  public assetToDelete: Asset | undefined;
  public TEXTS = TEXTS;
  public FeedbackType = FeedbackType;

  constructor(
    private dataService: DataService,
    private navigationService: NavigationService,
    private toastService: ToastService,
  ){}

  ngOnInit() {
    this.assets$.subscribe((assets: Asset[]) => {
      this.updateTotals(assets);
    });
  }

  public updateTotals(assets: Asset[]): void {
    let curTotal = 0;
    let initTotal = 0;
    assets.forEach((asset: Asset) => {
      curTotal += asset.curTotalValue ?? 0;
      initTotal += asset.initTotalValue ?? 0;
    });
    this.curTotal = curTotal;
    this.initTotal = initTotal;
  }

  public onDeleteAsset(asset: Asset): void {
    this.deleteConfirmPopup.show();
    this.assetToDelete = asset;
  }

  public onDetailsAsset(asset: Asset): void {
    this.navigationService.navigate('/asset/' + asset.assetId);
  }

  public onDeleteAssetConfirmed() {
    if(!this.assetToDelete || !this.assetToDelete.assetId) {
      this.toastService.showToast("This asset does not exist", FeedbackType.ERROR);
      return;
    }

    this.dataService.deleteAsset$(this.assetToDelete.assetId, this.loadingIndicator$).subscribe(() => {
      this.toastService.showToast("Successfully deleted " + this.assetToDelete?.assetName, FeedbackType.SUCCESS);
      this.assetToDelete = undefined;
    });
  }

  public getPercentChange(init: number, cur: number): number {
    if(!init || !cur || init === 0) {
      return 0;
    }
    return Math.abs(Math.round(((cur-init) / init) * 100));
  }

  public onAddAsset(): void {
    this.addAssetPopup.show();
  }

  public onPageReload() {
    location.reload();
  }
}
