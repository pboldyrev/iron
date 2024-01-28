import { Component, Input, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatMenuModule } from '@angular/material/menu';
import { Asset } from '../../../shared/constants/constants';
import { BluIcon } from 'projects/blueprint/src/lib/icon/icon.component';
import { BluText } from 'projects/blueprint/src/lib/text/text.component';
import { BluButton } from 'projects/blueprint/src/lib/button/button.component';
import { BehaviorSubject, Observable, combineLatest, concat, filter, map, merge, mergeMap, of, take, tap, toArray } from 'rxjs';
import { DataService } from '../../../shared/services/data.service';
import { CommonModule } from '@angular/common';
import { TEXTS } from './asset-table.strings';
import { BluTag } from 'projects/blueprint/src/lib/tag/tag.component';
import { ConfirmationPopupComponent } from '../../../shared/components/confirmation-popup/confirmation-popup.component';
import { Router } from '@angular/router';
import { BluValidationFeedback } from 'projects/blueprint/src/lib/validation-popup/validation-feedback.component';
import { FeedbackType } from 'projects/blueprint/src/lib/common/constants';
import { BluLink } from 'projects/blueprint/src/lib/link/link.component';
import { AddAssetPopupComponent } from '../dashboard-top-bar/add-asset-popup/add-asset-popup.component';
import { ToastService } from '../../../shared/services/toast.service';
import { NavigationService } from '../../../shared/services/navigation-service.service';
import { DisplayIntegerPipe } from 'projects/blueprint/src/lib/common/pipes/display-integer';
import { BluHeading } from 'projects/blueprint/src/lib/heading/heading.component';
import { BluSelect } from 'projects/blueprint/src/lib/select/select.component';
import { TIMEFRAMES } from './asset-table.constants';
import { BluModal } from 'projects/blueprint/src/lib/modal/modal.component';
import { DisplayCurrencyPipe } from "../../../../../projects/blueprint/src/lib/common/pipes/display-currency.pipe";
import { DisplayPercentPipe } from "../../../../../projects/blueprint/src/lib/common/pipes/display-percent.pipe";
import { PreferencesService, USER_PREFERENCES } from 'src/app/shared/services/preferences.service';
import { SelectionModel } from '@angular/cdk/collections';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { BluSpinner } from 'projects/blueprint/src/lib/spinner/spinner.component';

export type AssetTableColumn = 
  "select" |
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
    templateUrl: './asset-table.component.html',
    styleUrl: './asset-table.component.scss',
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
        DisplayIntegerPipe,
        BluHeading,
        BluSelect,
        BluModal,
        DisplayCurrencyPipe,
        DisplayPercentPipe,
        MatCheckboxModule,
        BluSpinner,
    ],
})

export class AssetTableComponent {
  @Input() columns!: AssetTableColumn[];
  @Input() assets$!: Observable<Asset[]>;
  @Input() loadingIndicator$!: BehaviorSubject<boolean>
  @Input() tableTitle = "";
  @Input() displayAssets: Asset[] = [];

  public preferenceName = '';

  public curTotal: number = 0;
  public initTotal: number = 0;

  public showData = true;

  public TEXTS = TEXTS;
  public TIMEFRAMES = TIMEFRAMES;
  public FeedbackType = FeedbackType;

  selection = new SelectionModel<Asset>(true, []);
  isDeleteSelectedLoading = false;

  constructor(
    private dataService: DataService,
    private navigationService: NavigationService,
    private toastService: ToastService,
    private preferencesService: PreferencesService,
  ){}

  ngOnInit() {
    this.assets$.subscribe((assets: Asset[]) => {
      this.updateTotals();
    });
    this.preferenceName = USER_PREFERENCES.ShowAccountData + '-' + this.tableTitle.replaceAll(' ', '');
    this.showData = (this.preferencesService.getPreference(this.preferenceName) ?? "true") === "true";
  }

  public updateTotals(): void {
    let curTotal = 0;
    let initTotal = 0;
    this.displayAssets.forEach((asset: Asset) => {
      curTotal += asset.curTotalValue ?? 0;
      initTotal += asset.initTotalValue ?? 0;
    });
    this.curTotal = curTotal;
    this.initTotal = initTotal;
  }

  public onDeleteAsset(asset: Asset): void {
    this.dataService.deleteAsset$(asset.assetId ?? "", this.loadingIndicator$).subscribe(() => {
      this.toastService.showToast("Successfully deleted " + asset.assetName, FeedbackType.SUCCESS);
    });
  }

  public onDetailsAsset(asset: Asset): void {
    this.navigationService.navigate('/asset/' + asset.assetId);
  }

  public getPercentChange(init: number, cur: number): number {
    if(!init || !cur) {
      return 0;
    }
    if(init === 0) {
      return NaN;
    }
    return ((cur-init) / init) * 100;
  }

  public onToggleShowData(): void {
    this.showData = !this.showData;
    this.preferencesService.setPreference(this.preferenceName, this.showData.toString());
  }

  onDeleteSelected(): void {
    let toBeDeleted$ = [] as Observable<Asset>[];
    this.selection.selected.forEach((asset: Asset) => {
      toBeDeleted$.push(this.dataService.deleteAsset$(asset.assetId ?? '', null, false))
    });

    this.isDeleteSelectedLoading = true;

    const batchSize = 9;
    const groupedResponses: Observable<Asset>[][] = [];
    
    while(toBeDeleted$.length) {
      groupedResponses.push(toBeDeleted$.splice(0, batchSize));
    }
    
    concat(
      ...groupedResponses.map((group) => merge(...group))
    ).pipe(
      toArray(),
      tap({
        error: () => {
          this.isDeleteSelectedLoading = false;
        },
        next: () => {
          this.isDeleteSelectedLoading = false;
          this.dataService.dataChanged$.next(true);
        }
      })
    ).subscribe();
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.displayAssets.length;
    return numSelected == numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.displayAssets.forEach(row => this.selection.select(row));
  }
}
