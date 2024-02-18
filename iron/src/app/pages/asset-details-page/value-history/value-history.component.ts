import { CommonModule } from '@angular/common';
import {
  AfterContentInit,
  AfterViewInit,
  Component,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { BluModal } from 'projects/blueprint/src/lib/modal/modal.component';
import { TEXTS } from './value-history.strings';
import { MatTableModule } from '@angular/material/table';
import { BluButton } from 'projects/blueprint/src/lib/button/button.component';
import { BluInput } from 'projects/blueprint/src/lib/input/input.component';
import {
  BehaviorSubject,
  Observable,
  Subject,
  combineLatest,
  filter,
  map,
  mergeMap,
  of,
  skip,
  take,
  tap,
} from 'rxjs';
import { FeedbackType } from 'projects/blueprint/src/lib/common/constants';
import { BluText } from 'projects/blueprint/src/lib/text/text.component';
import { BluValidationFeedback } from 'projects/blueprint/src/lib/validation-popup/validation-feedback.component';
import {
  Asset,
  AssetType,
  AssetValue,
} from '../../../shared/constants/constants';
import { DataService } from '../../../shared/services/data.service';
import { BluSpinner } from 'projects/blueprint/src/lib/spinner/spinner.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { BluHeading } from 'projects/blueprint/src/lib/heading/heading.component';
import { BluTag } from 'projects/blueprint/src/lib/tag/tag.component';
import { ToastService } from 'src/app/shared/services/toast.service';
import { HttpErrorResponse } from '@angular/common/http';
import {
  DISPLAYED_COLUMNS_STOCK_UNITS,
  DISPLAYED_COLUMNS_VALUE_HISTORY,
  STOCK_OPTIONS,
} from './value-history.constants';
import { BluLabel } from 'projects/blueprint/src/lib/label/label.component';
import { Chart } from 'chart.js';
import { ChartService } from 'src/app/shared/services/chart.service';
import { BluLink } from 'projects/blueprint/src/lib/link/link.component';
import { BluSelect } from 'projects/blueprint/src/lib/select/select.component';
import {
  PreferencesService,
  USER_PREFERENCES,
} from 'src/app/shared/services/preferences.service';
import { DisplayIntegerPipe } from '../../../../../projects/blueprint/src/lib/common/pipes/display-integer';
import { DisplayCurrencyPipe } from '../../../../../projects/blueprint/src/lib/common/pipes/display-currency.pipe';
import { DateService } from 'src/app/shared/services/date.service';

export type ValueChange = {
  amount?: number;
  percent?: number;
  text?: string;
};

@Component({
  selector: 'app-value-history',
  standalone: true,
  templateUrl: './value-history.component.html',
  styleUrl: './value-history.component.scss',
  imports: [
    CommonModule,
    BluModal,
    MatTableModule,
    BluButton,
    BluInput,
    BluLabel,
    BluText,
    BluValidationFeedback,
    BluSpinner,
    MatProgressBarModule,
    MatTooltipModule,
    MatMenuModule,
    BluHeading,
    BluTag,
    BluLink,
    BluSelect,
    DisplayIntegerPipe,
    DisplayCurrencyPipe,
  ],
})
export class ValueHistoryComponent {
  @ViewChild('valueInput') valueInput!: BluInput;
  @ViewChild('dateInput') dateInput!: BluInput;
  @ViewChild('stockActionDate') stockDateInput!: BluInput;
  @ViewChild('stockActionUnits') stockUnitsInput!: BluInput;
  @ViewChild('stockActionType') stockActionTypeInput!: BluInput;

  @Input() assetValues$ = new BehaviorSubject<AssetValue[]>([]);
  @Input() assetId!: string;
  @Input() asset$ = new BehaviorSubject<Asset>({});
  @Input() isLoading$ = new BehaviorSubject<boolean>(false);

  FeedbackType = FeedbackType;
  AssetType = AssetType;
  TEXTS = TEXTS;
  DISPLAYED_COLUMNS_VALUE_HISTORY = DISPLAYED_COLUMNS_VALUE_HISTORY;
  DISPLAYED_COLUMNS_STOCK_UNITS = DISPLAYED_COLUMNS_STOCK_UNITS;
  STOCK_OPTIONS = STOCK_OPTIONS;

  historyChart: Chart | null = null;
  showValueHistory = false;

  allowValueHistory = false;
  isAutomaticallyTracked = false;
  stockUnitChanges$ = new BehaviorSubject<AssetValue[]>([]);

  constructor(
    private dataService: DataService,
    private toastService: ToastService,
    private chartService: ChartService,
    private preferencesService: PreferencesService,
    private dateService: DateService,
  ) {}

  ngOnInit() {
    this.asset$.subscribe((asset: Asset) => {
      this.showValueHistory = asset.assetType === AssetType.Cash;
      this.allowValueHistory = asset.assetType !== AssetType.Stock;
      this.isAutomaticallyTracked = asset.assetType !== AssetType.Cash;

      const userHistoryOption = this.preferencesService.getPreference(
        USER_PREFERENCES.ShowValueHistory + '-' + this.assetId,
      );
      if (userHistoryOption) {
        this.showValueHistory = userHistoryOption === 'true';
      }
    });
    combineLatest([this.asset$, this.getChangesInUnits$()])
      .pipe(
        filter(
          ([asset, assetValues]: [Asset, AssetValue[]]) =>
            asset.assetType === AssetType.Stock,
        ),
      )
      .subscribe(([asset, assetValues]: [Asset, AssetValue[]]) => {
        this.stockUnitChanges$.next(assetValues);
      });
  }

  private getChangesInUnits$(): Observable<AssetValue[]> {
    return this.assetValues$.pipe(
      map((assetValues: AssetValue[]) => {
        if (assetValues.length === 0) {
          return [];
        }

        let unitChanges = [assetValues[0]];
        let curUnits = unitChanges[0].units;

        assetValues.forEach((assetValue: AssetValue) => {
          if (assetValue.units !== curUnits) {
            unitChanges.push(assetValue);
            curUnits = assetValue.units;
          }
        });

        return unitChanges;
      }),
    );
  }

  public updateChart(data: AssetValue[]): void {
    if (this.historyChart) {
      this.historyChart.data = this.chartService.getDataSet(data);
      this.historyChart.options.borderColor =
        this.chartService.getBorderColor(data);
      this.historyChart.update();
    } else {
      this.historyChart = new Chart(
        'detailChart',
        this.chartService.getOptions(data),
      );
    }
  }

  public toggleValueHistory(): void {
    if (this.allowValueHistory) {
      this.showValueHistory = !this.showValueHistory;
      this.preferencesService.setPreference(
        USER_PREFERENCES.ShowValueHistory + '-' + this.assetId,
        this.showValueHistory ? 'true' : 'false',
      );
    }
  }

  public onAddEntry(): void {
    const valueInput = this.valueInput.validate();
    const dateInput = this.dateInput.validate();

    if (!this.verifyNewEntry(valueInput, dateInput)) {
      return;
    }

    let dateInputTimestamp = new Date(dateInput).getTime();
    this.getMatchingTimestampIfExists$(dateInputTimestamp)
      .pipe(
        mergeMap((finalTimestamp: number) => {
          return this.addEntry$(valueInput, finalTimestamp);
        }),
      )
      .subscribe({
        next: (timestamp: string) => {
          this.toastService.showToast(
            'Successfully added the entry for ' +
              new Date(timestamp).toDateString(),
            FeedbackType.SUCCESS,
          );
          this.valueInput.clearValueAndValidators();
          this.dateInput.clearValueAndValidators();
        },
        error: (error) => {
          this.toastService.showToast(
            'Something went wrong, please try again',
            FeedbackType.ERROR,
          );
          console.log(error);
        },
      });
  }

  onStockUnitsUpdate(): void {
    const date = this.stockDateInput.validate();
    const units = parseFloat(this.stockUnitsInput.validate());
    const type = this.stockActionTypeInput.validate();

    if (
      !this.stockDateInput.isValid ||
      !this.stockUnitsInput.isValid ||
      !this.stockActionTypeInput.isValid
    ) {
      return;
    }

    let dateInputTimestamp = new Date(date).getTime();
    let finalTimestamp: number;
    let finalUnits: number;

    this.getMatchingTimestampIfExists$(dateInputTimestamp)
      .pipe(
        take(1),
        mergeMap((timestamp: number) => {
          finalTimestamp = timestamp;
          return this.getMostRecentUnits$(timestamp);
        }),
        map((unitsToSet: number) => {
          if (type === STOCK_OPTIONS[0]) {
            unitsToSet += units;
          } else {
            unitsToSet -= units;
          }
          finalUnits = unitsToSet;
        }),
        filter(() => {
          let isValid = true;
          if (finalUnits < 0) {
            if (type === STOCK_OPTIONS[0]) {
              this.stockUnitsInput.customFeedback =
                'You may not purchase negative units, please sell units instead.';
            } else {
              this.stockUnitsInput.customFeedback =
                'You may not oversell your owned units. You are ' +
                Math.abs(finalUnits) +
                ' units short.';
            }
            this.stockUnitsInput.isValid = false;
            isValid = false;
          }

          if (
            finalTimestamp >= this.dateService.getLatestValidDate().getTime()
          ) {
            this.stockDateInput.customFeedback =
              'Please enter a date in the past';
            this.stockDateInput.isValid = false;
            isValid = false;
          }

          return isValid;
        }),
        mergeMap(() => {
          return this.asset$;
        }),
        take(1),
        mergeMap((asset: Asset) => {
          return this.dataService.putAssetValue$(
            asset.assetId ?? '',
            {
              timestamp: finalTimestamp,
              units: finalUnits,
              totalValue: 0,
            },
            this.isLoading$,
          );
        }),
      )
      .subscribe(() => {
        this.stockUnitsInput.clearValueAndValidators();
        this.stockDateInput.clearValueAndValidators();
      });
  }

  public onDeleteEntry(entryToDelete: AssetValue): void {
    this.dataService
      .deleteAssetValue$(
        this.assetId,
        entryToDelete.timestamp ?? 0,
        this.isLoading$,
      )
      .subscribe(() => {
        this.toastService.showToast(
          'Successfully removed the entry for ' +
            new Date(entryToDelete.timestamp).toDateString(),
          FeedbackType.SUCCESS,
        );
      });
  }

  public getDateString(ms: string) {
    return new Date(ms).toLocaleDateString('en-US', { timeZone: 'UTC' });
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
      this.toastService.showToast(
        'Please fill in the date and value fields with valid values.',
        FeedbackType.ERROR,
      );
      return false;
    }

    if (value.charAt(0) === '$') {
      this.toastService.showToast(
        'Please do not include currency symbols in the value field.',
        FeedbackType.ERROR,
      );
      return false;
    }
    const curDate = new Date();
    curDate.setDate(curDate.getDate() - 1);
    const selectedDate = new Date(date);
    const minDate = new Date(-631152000000);
    if (selectedDate > curDate) {
      this.toastService.showToast(
        'Please select a date in the past.',
        FeedbackType.ERROR,
      );
    }
    if (selectedDate < minDate) {
      this.toastService.showToast(
        'We only support assets with history after Jan 1, 1950.',
        FeedbackType.ERROR,
      );
    }
    return selectedDate <= curDate && selectedDate > minDate;
  }

  private getMostRecentUnits$(timestamp: number): Observable<number> {
    return this.assetValues$.pipe(
      take(1),
      map((assetValues: AssetValue[]) => {
        let units = 0;
        assetValues.forEach((assetValue: AssetValue) => {
          if (assetValue.timestamp <= timestamp) {
            units = assetValue.units;
          }
        });
        return units;
      }),
    );
  }

  private getMostRecentValue$(timestamp: number): Observable<number> {
    return this.assetValues$.pipe(
      take(1),
      map((assetValues: AssetValue[]) => {
        let value = 0;
        assetValues.forEach((assetValue: AssetValue) => {
          if (assetValue.timestamp <= timestamp) {
            value = assetValue.totalValue;
          }
        });
        return value;
      }),
    );
  }

  getUnitChangeSince$(assetValue: AssetValue): Observable<number> {
    return this.getMostRecentUnits$(assetValue.timestamp - 1).pipe(
      map((recentUnits: number) => {
        return assetValue.units - recentUnits;
      }),
    );
  }

  getValueChangeSince$(assetValue: AssetValue): Observable<number> {
    return this.getMostRecentValue$(assetValue.timestamp - 1).pipe(
      map((recentValue: number) => {
        return assetValue.totalValue - recentValue;
      }),
    );
  }

  private getMatchingTimestampIfExists$(input: number): Observable<number> {
    let startTime = input - 43199999;
    let endTime = input + 43199999;

    return this.assetValues$.pipe(
      take(1),
      map((assetValues: AssetValue[]) => {
        let matchingTimes = assetValues
          .filter((assetValue: AssetValue) => {
            return (
              assetValue.timestamp >= startTime &&
              assetValue.timestamp <= endTime
            );
          })
          .map((asset: AssetValue) => asset.timestamp);

        if (matchingTimes.length > 0) {
          return matchingTimes[0];
        }

        return input;
      }),
    );
  }
}
