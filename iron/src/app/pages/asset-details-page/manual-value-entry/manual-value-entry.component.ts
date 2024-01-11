import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild } from '@angular/core';
import { BluButton } from 'projects/blueprint/src/lib/button/button.component';
import { FeedbackType } from 'projects/blueprint/src/lib/common/constants';
import { BluInput } from 'projects/blueprint/src/lib/input/input.component';
import { BehaviorSubject, Observable, combineLatest, filter, mergeMap, take } from 'rxjs';
import { AssetValue } from 'src/app/shared/constants/constants';
import { DataService } from 'src/app/shared/services/data.service';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'app-manual-value-entry',
  standalone: true,
  imports: [CommonModule, BluInput, BluButton],
  templateUrl: './manual-value-entry.component.html',
  styleUrl: './manual-value-entry.component.scss'
})
export class ManualValueEntryComponent {
  @ViewChild('value') valueInput!: BluInput;
  @ViewChild('date') dateInput!: BluInput;

  @Input() assetId: string = "";
  @Input() isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  
  FeedbackType = FeedbackType;

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
