import { CommonModule } from '@angular/common';
import { Component, Input, Output, ViewChild } from '@angular/core';
import { BluModal } from 'projects/blueprint/src/lib/modal/modal.component';
import { TEXTS } from './value-history.strings';
import { MatTableModule } from '@angular/material/table';
import { BluButton } from 'projects/blueprint/src/lib/button/button.component';
import { BluInput } from 'projects/blueprint/src/lib/input/input.component';
import { BehaviorSubject, Observable, Subject, combineLatest, filter, map, mergeMap, of, skip, take, tap } from 'rxjs';
import { FeedbackType } from 'projects/blueprint/src/lib/common/constants';
import { BluText } from 'projects/blueprint/src/lib/text/text.component';
import { BluValidationFeedback } from 'projects/blueprint/src/lib/validation-popup/validation-feedback.component';
import { Asset, AssetType, AssetValue } from '../../../shared/constants/constants';
import { DataService } from '../../../shared/services/data.service';
import { BluSpinner } from 'projects/blueprint/src/lib/spinner/spinner.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { BluHeading } from 'projects/blueprint/src/lib/heading/heading.component';
import { BluTag } from 'projects/blueprint/src/lib/tag/tag.component';
import { ToastService } from 'src/app/shared/services/toast.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DISPLAYED_COLUMNS, STOCK_OPTIONS } from './value-history.constants';
import { BluLabel } from 'projects/blueprint/src/lib/label/label.component';
import { Chart } from 'chart.js';
import { ChartService } from 'src/app/shared/services/chart.service';
import { BluLink } from 'projects/blueprint/src/lib/link/link.component';
import { BluSelect } from 'projects/blueprint/src/lib/select/select.component';
import { PreferencesService, USER_PREFERENCES } from 'src/app/shared/services/preferences.service';

export type ValueChange = {
  amount?: number,
  percent?: number,
  text?: string,
}

@Component({
  selector: 'app-value-history',
  standalone: true,
  imports: [CommonModule, BluModal, MatTableModule, BluButton, BluInput, BluLabel, BluText, BluValidationFeedback, BluSpinner, MatProgressBarModule, MatTooltipModule, MatMenuModule, BluHeading, BluTag, BluLink, BluSelect],
  templateUrl: './value-history.component.html',
  styleUrl: './value-history.component.scss'
})
export class ValueHistoryComponent {
  @ViewChild('value') valueInput!: BluInput;
  @ViewChild('date') dateInput!: BluInput;
  @ViewChild('stockActionDate') stockDateInput!: BluInput;
  @ViewChild('stockActionUnits') stockUnitsInput!: BluInput;
  
  @Input() assetValues = [] as AssetValue[];
  @Input() assetId = "";
  @Input() asset$ = new BehaviorSubject<Asset>({});
  @Input() isLoading$= new BehaviorSubject<boolean>(false);

  FeedbackType = FeedbackType;
  AssetType = AssetType;
  TEXTS = TEXTS;
  DISPLAYED_COLUMNS = DISPLAYED_COLUMNS;
  STOCK_OPTIONS = STOCK_OPTIONS;

  historyChart: Chart | null = null;
  showValueHistory = false;
  allowValueHistory = false;
  isAutomaticallyTracked = false;
  assetType = AssetType.Cash;

  constructor(
    private dataService: DataService,
    private toastService: ToastService,
    private chartService: ChartService,
    private preferenceService: PreferencesService,
  ) {}

  ngOnInit() {
    this.asset$.subscribe((asset: Asset) => {
      this.showValueHistory = asset.assetType === AssetType.Cash;
      this.allowValueHistory = asset.assetType !== AssetType.Stock;
      this.isAutomaticallyTracked = asset.assetType !== AssetType.Cash;
      this.assetType = asset.assetType ?? AssetType.Cash;

      const userHistoryOption = this.preferenceService.getPreference(USER_PREFERENCES.ShowValueHistory + '-' + this.assetId);
      if(userHistoryOption) {
        this.showValueHistory = userHistoryOption === "true";
      }
    });
  }

  public updateChart(data: AssetValue[]): void {
    if(this.historyChart) {
      this.historyChart.data = this.chartService.getDataSet(data);
      this.historyChart.options.borderColor = this.chartService.getBorderColor(data);
      this.historyChart.update();
    } else {
      this.historyChart = new Chart('detailChart', this.chartService.getOptions(data));
    }
  }

  public toggleValueHistory(): void {
    if(this.allowValueHistory) {
      this.showValueHistory = !this.showValueHistory;
      this.preferenceService.setPreference(USER_PREFERENCES.ShowValueHistory + '-' + this.assetId, this.showValueHistory ? 'true' : 'false');
    }
  }

  public onAddEntry(): void {
    const valueInput = this.valueInput.validate();
    const dateInput = this.dateInput.validate();

    if(!this.verifyNewEntry(valueInput, dateInput)) {
      return;
    }

    let dateInputTimestamp = new Date((new Date(dateInput)).toLocaleDateString('en-US', {timeZone: 'UTC'})).valueOf()
    let startTime = dateInputTimestamp - 43199999;
    let endTime = dateInputTimestamp + 43199999;

    let matchingTimes = this.assetValues
      .filter((assetValue: AssetValue) => {
        return assetValue.timestamp >= startTime && assetValue.timestamp <= endTime;
      }).map((asset: AssetValue) => asset.timestamp);

    if(matchingTimes.length > 0) {
      dateInputTimestamp = matchingTimes[0];
    }

    this.addEntry$(valueInput, dateInputTimestamp)
    .subscribe({
      next: (timestamp: string) => {
        this.toastService.showToast("Successfully added the entry for " + new Date(timestamp ?? 0).toLocaleDateString('en-US', {timeZone: 'UTC'}), FeedbackType.SUCCESS);
        this.valueInput.clearValueAndValidators();
        this.dateInput.clearValueAndValidators();
      },
      error: (error) => {
        this.toastService.showToast("Something went wrong, please try again", FeedbackType.ERROR);
        console.log(error);
      }
    })
  }

  private deleteDuplicateTimes$(timestamps: number[]): Observable<string[]> | null {
    if(timestamps.length === 0) {
      return null;
    }

    let deletions = [] as Observable<string>[];

    timestamps.forEach((time: number) => {
      deletions.push(this.dataService.deleteAssetValue$(this.assetId, time));
    })

    return combineLatest(deletions);
  }

  onStockUnitsUpdate(): void {
    const date = this.stockDateInput.validate();
    const units = this.stockUnitsInput.validate();

    if(!this.stockDateInput.isValid || !this.stockUnitsInput.isValid) {
      return;
    }

    this.asset$.pipe(
      take(1),
      mergeMap((asset: Asset) => {
        return this.dataService.putAssetValue$(asset.assetId ?? "", {
          timestamp: (new Date(date)).valueOf(),
          units: parseInt(units),
          totalValue: 0,
        }, this.isLoading$)
      })
    ).subscribe();
  }

  public onDeleteEntry(entryToDelete: AssetValue): void {
    this.dataService.deleteAssetValue$(this.assetId, entryToDelete.timestamp ?? 0, this.isLoading$).subscribe(() => {
        this.toastService.showToast("Successfully removed the entry for " + new Date(entryToDelete.timestamp ?? 0).toLocaleDateString('en-US', {timeZone: 'UTC'}), FeedbackType.SUCCESS);
      }
    );
  }

  public getDateString(ms: string) {
    return (new Date(ms)).toLocaleDateString('en-US', {timeZone: 'UTC'});
  }

  private addEntry$(value: string, timestamp: number): Observable<string> {
    const newValue: AssetValue = {
      timestamp: timestamp,
      totalValue: parseFloat(value),
      units: 1,
    };
    return this.dataService.putAssetValue$(
      this.assetId || '',
      newValue,
      this.isLoading$,
    );
  }

  private verifyNewEntry(value: string, date: string): boolean {
    if (!value || !date) {
      this.toastService.showToast("Please fill in the date and value fields with valid values.", FeedbackType.ERROR);
      return false;
    }

    if(value.charAt(0) === '$') {
      this.toastService.showToast("Please do not include currency symbols in the value field.", FeedbackType.ERROR);
      return false;
    }
    const curDate = new Date();
    curDate.setDate(curDate.getDate() - 1);
    const selectedDate = new Date(date);
    const minDate = new Date("1950-1-1");
    if (selectedDate > curDate) {
      this.toastService.showToast("Please select a date in the past.", FeedbackType.ERROR);
    }
    if (selectedDate < minDate) {
      this.toastService.showToast("We only support assets with history after Jan 1, 1950.", FeedbackType.ERROR);
    }
    return selectedDate <= curDate && selectedDate > minDate;
  }
}
