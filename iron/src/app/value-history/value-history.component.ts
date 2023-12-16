import { CommonModule } from '@angular/common';
import { Component, Input, Output, ViewChild } from '@angular/core';
import { BluModal } from 'projects/blueprint/src/lib/modal/modal.component';
import { TEXTS } from './value-history.strings';
import { MatTableModule } from '@angular/material/table';
import { BluButton } from 'projects/blueprint/src/lib/button/button.component';
import { BluInput } from 'projects/blueprint/src/lib/input/input.component';
import { BehaviorSubject, Subject, combineLatest, filter, mergeMap, take, tap } from 'rxjs';
import { FeedbackType } from 'projects/blueprint/src/lib/common/constants';
import { BluText } from 'projects/blueprint/src/lib/text/text.component';
import { BluValidationFeedback } from 'projects/blueprint/src/lib/validation-popup/validation-feedback.component';
import { Asset, AssetValue } from '../shared/constants/constants';
import { DataService } from '../shared/services/data.service';
import { BluSpinner } from 'projects/blueprint/src/lib/spinner/spinner.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-value-history',
  standalone: true,
  imports: [CommonModule, BluModal, MatTableModule, BluButton, BluInput, BluText, BluValidationFeedback, BluSpinner, MatProgressBarModule, MatTooltipModule],
  templateUrl: './value-history.component.html',
  styleUrl: './value-history.component.scss'
})
export class ValueHistoryComponent {
  @ViewChild('value') valueInput!: BluInput;
  @ViewChild('date') dateInput!: BluInput;

  @Input() userId!: string;
  @Input() assetId!: string;

  @Output() savedData: Subject<AssetValue[]> = new Subject<AssetValue[]>();

  public FeedbackType = FeedbackType;
  public TEXTS = TEXTS;
  public entries$: BehaviorSubject<AssetValue[]> = new BehaviorSubject<AssetValue[]>([]);
  public newEntries$: BehaviorSubject<AssetValue[]> = new BehaviorSubject<AssetValue[]>([]);
  public showAddOneError$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public isLoading = false;
  public isSaving = false;

  constructor(
    private dataService: DataService,
  ) {}

  ngOnInit() {
    this.isLoading = true;

    this.dataService.getAssetById$(this.userId, this.assetId)
    .pipe(
      filter(asset => !!asset),
    ).subscribe((asset: Asset | null) => {
      this.entries$.next(asset?.historicalValues ?? []);
      this.isLoading = false;
    });
  }

  public onSaveAsset(): void {
    this.isSaving = true;
    combineLatest([
      this.entries$,
      this.newEntries$
    ]).pipe(
      take(1)
    ).subscribe(([existingEntries, newEntries]) => {
      if(newEntries.length !== 0) {
        this.savedData.next(newEntries);
        this.reset();
        return;
      }

      if(existingEntries.length === 0) {
        this.showAddOneError$.next(true);
        this.isSaving = false;
        return;
      }

      this.savedData.next(newEntries);
      this.reset();
    });
  }

  public onAddEntry(): void {
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

  public onDeleteEntry(entryToDelete: AssetValue): void {
    combineLatest([
      this.entries$,
      this.newEntries$
    ]).pipe(
      take(1),
      tap(([existingEntries, newEntries]: [AssetValue[], AssetValue[]]) => {
        this.newEntries$.next(newEntries.filter((entry) => entry.date !== entryToDelete.date));
        this.entries$.next(existingEntries.filter((entry) => entry.date !== entryToDelete.date));
      }),
      mergeMap(() => {
        return this.dataService.deleteAssetHistoryEntry$(this.userId, this.assetId, entryToDelete);
      }),
    ).subscribe();
  }

  private pushEntry(date: string, value: number) {
    this.newEntries$.pipe(take(1)).subscribe((entries: AssetValue[]) => {
      entries.push({
        date: date,
        value: value
      });
      this.newEntries$.next(entries);
    });
  }

  private reset() {
    this.entries$.next([]);
    this.newEntries$.next([]);
    this.isLoading = false;
    this.isSaving = false;
  }
}
