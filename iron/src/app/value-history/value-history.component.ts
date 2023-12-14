import { CommonModule } from '@angular/common';
import { Component, Output, ViewChild } from '@angular/core';
import { BluModal } from 'projects/blueprint/src/lib/modal/modal.component';
import { TEXTS } from './value-history.strings';
import { MatTableModule } from '@angular/material/table';
import { BluButton } from 'projects/blueprint/src/lib/button/button.component';
import { BluInput } from 'projects/blueprint/src/lib/input/input.component';
import { BehaviorSubject, Subject, combineLatest, take } from 'rxjs';
import { ValueHistoryEntry } from './value-history.constants';
import { FeedbackType } from 'projects/blueprint/src/lib/common/constants';
import { BluText } from 'projects/blueprint/src/lib/text/text.component';
import { BluValidationFeedback } from 'projects/blueprint/src/lib/validation-popup/validation-feedback.component';

@Component({
  selector: 'app-value-history',
  standalone: true,
  imports: [CommonModule, BluModal, MatTableModule, BluButton, BluInput, BluText, BluValidationFeedback],
  templateUrl: './value-history.component.html',
  styleUrl: './value-history.component.scss'
})
export class ValueHistoryComponent {
  @ViewChild('value') valueInput!: BluInput;
  @ViewChild('date') dateInput!: BluInput;

  @Output() savedData: Subject<ValueHistoryEntry[]> = new Subject<ValueHistoryEntry[]>();

  public FeedbackType = FeedbackType;
  public TEXTS = TEXTS;
  public entries$: BehaviorSubject<ValueHistoryEntry[]> = new BehaviorSubject<ValueHistoryEntry[]>([]);
  public showAddOneError$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public onSaveAsset() {
    this.entries$.pipe(take(1)).subscribe((entries: ValueHistoryEntry[]) => {
      if(entries.length === 0) {
        this.showAddOneError$.next(true);
        return;
      }
      
      this.savedData.next(entries);
      this.reset();
    });
  }

  public onAddEntry() {
    this.valueInput.validate();
    this.dateInput.validate();

    combineLatest([
      this.valueInput.isValid$,
      this.valueInput.value$,
      this.dateInput.isValid$,
      this.dateInput.value$,
    ]).pipe(take(1)).subscribe(([
      isValueValid,
      value,
      isDateValid,
      date,
    ]: [
      boolean,
      string,
      boolean,
      string
    ]) => {
      if (!isValueValid || !isDateValid) {
        return;
      }

      this.pushEntry(date, parseInt(value));
      this.dateInput.clearValueAndValidators();
      this.valueInput.clearValueAndValidators();
    });
  }

  private pushEntry(date: string, value: number) {
    this.entries$.pipe(take(1)).subscribe((entries: ValueHistoryEntry[]) => {
      entries.push({
        date: date,
        value: value
      });
      this.entries$.next(entries);
    });
  }

  private reset() {
    this.entries$.next([]);
  }
}
