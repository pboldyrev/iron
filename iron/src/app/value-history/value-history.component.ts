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
import { Asset, AssetValue } from '../shared/constants/constants';
import { DataService } from '../shared/services/data.service';
import { BluSpinner } from 'projects/blueprint/src/lib/spinner/spinner.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { BluHeading } from 'projects/blueprint/src/lib/heading/heading.component';
import { BluTag } from 'projects/blueprint/src/lib/tag/tag.component';

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

  @Input() userId!: string;
  @Input() assetId!: string;

  @Input() asset$: BehaviorSubject<Asset> = new BehaviorSubject<Asset>({});
  @Input() outline: boolean = false;

  public FeedbackType = FeedbackType;
  public TEXTS = TEXTS;
  public showAddError$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public newEntry$: BehaviorSubject<AssetValue> = new BehaviorSubject<AssetValue>({});
  public isLoading = false;
  public isSaving = false;
  public displayedColumns = ['date', 'value', 'action'];
  public displayedFooterColumns = ['addDate', 'addValue', 'addAction'];
  public valueChange$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public valueChangeString$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor(
    private dataService: DataService,
  ) {}

  ngOnInit() {
    this.isLoading = true;

    this.asset$.pipe(
      filter((asset : Asset) => !!asset.id),
      tap(() => this.isLoading = false),
    ).subscribe();

    combineLatest([
      this.getValueChange$(),
      this.getValueChangeString$(),
    ]).subscribe(([valueChange, valueChangeString]) => {
      this.valueChange$.next(valueChange);
      this.valueChangeString$.next(valueChangeString);
    });
  }

  public onSaveAsset(): void {
    this.isSaving = true;
    combineLatest([
      this.newEntry$,
      this.asset$
    ]).pipe(
      take(1),
      filter(([newEntry, asset]: [AssetValue, Asset]) => !!asset.id),
      mergeMap(([newEntry, asset]: [AssetValue, Asset]) => {
        return this.dataService.appendAssetHistory$(this.userId, asset.id ?? '', newEntry)
      })).subscribe(() => {
      this.isSaving = false;
    })
  }

  public onAddEntry(): void {
    this.showAddError$.next(false);

    this.valueInput.validate();
    this.dateInput.validate();

    combineLatest([
      this.asset$,
      this.valueInput.isValid$,
      this.valueInput.value$,
      this.dateInput.isValid$,
      this.dateInput.value$,
    ]).pipe(
      take(1),
      tap(([
        asset,
        isValueValid,
        value,
        isDateValid,
        date,
      ]: [
        Asset,
        boolean,
        string,
        boolean,
        string
      ]) => {
        if (!isValueValid || !isDateValid) {
          this.showAddError$.next(true);
        } else {
          this.dateInput.clearValueAndValidators();
          this.valueInput.clearValueAndValidators();
        }
      }),
      filter(([
        asset,
        isValueValid,
        value,
        isDateValid,
        date,
      ]: [
        Asset,
        boolean,
        string,
        boolean,
        string
      ]) => isDateValid && isValueValid),
      mergeMap(([
        asset,
        isValueValid,
        value,
        isDateValid,
        date,
      ]: [
        Asset,
        boolean,
        string,
        boolean,
        string
      ]) => {
        const newValue: AssetValue = {date: date, value: parseInt(value)};
        asset.historicalValues = [
          ...asset.historicalValues ?? [],
          newValue,
        ];
        this.asset$.next(asset);
        return this.dataService.appendAssetHistory$(this.userId, asset.id ?? '', newValue);
      })
    ).subscribe();
  }

  public onDeleteEntry(entryToDelete: AssetValue): void {
    this.asset$.pipe(
      take(1),
      mergeMap((
        asset: Asset,
      ) => {
        asset.historicalValues = asset.historicalValues?.filter((asset) => asset.date !== entryToDelete.date);
        this.asset$.next(asset);

        return this.dataService.deleteAssetHistoryEntry$(this.userId, asset.id ?? '', entryToDelete);
      })
    ).subscribe();
  }

  public getValueChange$(): Observable<number> {
    return this.dataService.getAssetById$(this.userId, this.assetId).pipe(
      filter((asset: Asset) => !!asset.id),
      map((asset: Asset) => {
        const curValue = asset?.curValue ?? 0;
        const initValue = asset?.initValue ?? 0;
        return curValue - initValue;
      }),
    )
  }

  public getValueChangeString$(): Observable<string> {
    return this.dataService.getAssetById$(this.userId, this.assetId).pipe(
      filter((asset: Asset) => !!asset.id),
      map((asset: Asset) => {
        const curValue = asset?.curValue ?? 0;
        const initValue = asset?.initValue ?? 0;
        let percentChange = 0;
        let changeSymbol;

        if(initValue !== 0) {
          percentChange = Math.round(Math.abs((curValue-initValue)/initValue) * 100);
        }

        if(curValue - initValue >= 0) {
          changeSymbol = "+";
        } else {
          changeSymbol = "-"
        }

        return changeSymbol + '$' + Math.abs((curValue - initValue)).toLocaleString() + ' (' + percentChange + '%)';
      }),
    )
  }
}
