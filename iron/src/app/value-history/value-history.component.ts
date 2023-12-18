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

  @Input() assetId!: string;

  @Input() asset$: BehaviorSubject<Asset> = new BehaviorSubject<Asset>({});
  @Input() outline: boolean = false;

  public FeedbackType = FeedbackType;
  public TEXTS = TEXTS;
  public error$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public newEntry$: BehaviorSubject<AssetValue> = new BehaviorSubject<AssetValue>({});
  public isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public displayedColumns = ['date', 'value', 'action'];
  public displayedFooterColumns = ['addDate', 'addValue', 'addAction'];
  public valueChange: ValueChange = {};
  public valueChangeString: string = '';

  constructor(
    private dataService: DataService,
  ) {}

  private fetchAsset$(): Observable<void> {
    return this.dataService.getAssetById$(this.assetId, this.isLoading$).pipe(
      map((asset: Asset) => {
        this.asset$.next(asset);
        this.setValueChange(asset);
      })
    )
  }

  ngOnInit() {
    this.fetchAsset$().subscribe()
    this.dataService.dataChanged$.pipe(
      mergeMap(() => {
        return this.fetchAsset$();
      })
    ).subscribe();
  }

  public onAddEntry(): void {
    this.error$.next('');

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
      ]) => {
        if (!isValueValid || !isDateValid) {
          this.error$.next("Please fill in the date and value fields.");
        }
        if (new Date(date).valueOf() > Date.now().valueOf()) {
          this.error$.next("Date can not be in the future.");
        }
        return isDateValid && isValueValid && parseInt(date) > Date.now().valueOf()
      }),
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
        const clonedAsset = structuredClone(asset);
        const newValue: AssetValue = {
          timestamp: new Date(date).valueOf(),
          value: parseFloat(value)
        };
        this.newEntry$.next(newValue);
        clonedAsset.totalValues = [
          ...asset.totalValues ?? [],
          newValue
        ]
        return this.dataService.putAsset$(clonedAsset, this.isLoading$);
      })
    ).subscribe({
      next: () => {
      },
      error: (error) => {
        this.isLoading$.next(false);
        this.error$.next('Something went wrong.');
        console.log(error);
      }
    })
  }

  public onDeleteEntry(entryToDelete: AssetValue): void {
    this.asset$.pipe(
      take(1),
      mergeMap((
        asset: Asset,
      ) => {
        const clonedAsset = structuredClone(asset);
        clonedAsset.totalValues = clonedAsset.totalValues?.filter((asset: AssetValue) => asset.timestamp !== entryToDelete.timestamp);

        return this.dataService.putAsset$(clonedAsset, this.isLoading$);
      })
    ).subscribe({
      next: () => {
      },
      error: (error) => {
        this.isLoading$.next(false);
        this.error$.next('Something went wrong.');
        console.log(error);
      }
    });
  }

  private setValueChange(asset: Asset): void {
    let initValue;
    let curValue = asset.curValue ?? 0;
    let valueHistory = asset.totalValues ?? [];

    if(valueHistory.length > 0) {
      // Oldest value is the first array element
      initValue = valueHistory[0].value ?? 0;
    } else {
      initValue = curValue;
    }
    let valueChange = curValue - initValue;
    let percentChange;
    if(initValue === 0) {
      percentChange = 0;
    } else {
      percentChange = Math.round(Math.abs(valueChange/initValue) * 100);
    }
    let changeString = '';
    if(valueChange < 0) {
      changeString += '-';
    } else {
      changeString += '+';
    }
    changeString += '$' + Math.abs(valueChange).toString() + ' (' + percentChange.toString() + '%)';

    this.valueChange = {
      amount: valueChange,
      percent: percentChange,
      text: changeString
    }
  }

  public getDateString(ms: string) {
    return (new Date(ms)).toLocaleDateString();
  }
}
