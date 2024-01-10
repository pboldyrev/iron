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
import { Asset, AssetValue } from '../../../shared/constants/constants';
import { DataService } from '../../../shared/services/data.service';
import { BluSpinner } from 'projects/blueprint/src/lib/spinner/spinner.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { BluHeading } from 'projects/blueprint/src/lib/heading/heading.component';
import { BluTag } from 'projects/blueprint/src/lib/tag/tag.component';
import { ToastService } from 'src/app/shared/services/toast.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DISPLAYED_COLUMNS } from './value-history.constants';

export type ValueChange = {
  amount?: number,
  percent?: number,
  text?: string,
}

@Component({
  selector: 'app-value-history',
  standalone: true,
  imports: [CommonModule, BluModal, MatTableModule, BluButton, BluInput, BluText, BluValidationFeedback, BluSpinner, MatProgressBarModule, MatTooltipModule, MatMenuModule, BluHeading, BluTag],
  templateUrl: './value-history.component.html',
  styleUrl: './value-history.component.scss'
})
export class ValueHistoryComponent {
  @ViewChild('value') valueInput!: BluInput;
  @ViewChild('date') dateInput!: BluInput;
  
  @Input() assetValues: AssetValue[] = [];
  @Input() assetId: string = "";
  @Input() isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public FeedbackType = FeedbackType;
  public TEXTS = TEXTS;
  public DISPLAYED_COLUMNS = DISPLAYED_COLUMNS;

  constructor(
    private dataService: DataService,
    private toastService: ToastService,
  ) {}

  public onAddEntry(): void {
    combineLatest([
      this.valueInput.validate$(),
      this.dateInput.validate$(),
    ]).pipe(
      take(1),
      filter((input: any) => {
        return this.verifyNewEntry(input);
      }),
      mergeMap((input: any) => {
        return this.addEntry$(input);
      })
    ).subscribe({
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

  public onDeleteEntry(entryToDelete: AssetValue): void {
    this.dataService.deleteAssetValue$(this.assetId, entryToDelete.timestamp ?? 0, this.isLoading$).subscribe(() => {
        this.toastService.showToast("Successfully removed the entry for " + new Date(entryToDelete.timestamp ?? 0).toLocaleDateString('en-US', {timeZone: 'UTC'}), FeedbackType.SUCCESS);
      }
    );
  }

  public getDateString(ms: string) {
    return (new Date(ms)).toLocaleDateString('en-US', {timeZone: 'UTC'});
  }

  private addEntry$([
    value,
    date,
  ]: [
    string,
    string
  ]): Observable<string> {
    const newValue: AssetValue = {
      timestamp: new Date(date).valueOf(),
      totalValue: parseFloat(value),
      units: 1,
    };
    return this.dataService.putAssetValue$(
      this.assetId || '',
      newValue,
      this.isLoading$,
    );
  }

  private verifyNewEntry([
    value,
    date
  ]: [
    string,
    string
  ]): boolean {
    if (!value || !date) {
      this.toastService.showToast("Please fill in the date and value fields with valid values", FeedbackType.ERROR);
      return false;
    }

    if(value.charAt(0) === '$') {
      this.toastService.showToast("Please do not include currency symbols in the value field.", FeedbackType.ERROR);
      return false;
    }
    const curDate = Date.now().valueOf();
    const selectedDate = new Date(date).valueOf();
    const minDate = new Date("1900-1-1").valueOf();
    if (selectedDate > curDate) {
      this.toastService.showToast("Date can not be in the future", FeedbackType.ERROR);
    }
    if (selectedDate < minDate) {
      this.toastService.showToast("We only support assets with history after Jan 1, 1900", FeedbackType.ERROR);
    }
    return selectedDate <= curDate && selectedDate > minDate;
  }
}
