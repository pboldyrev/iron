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

  @Input() assetId!: string;

  @Input() asset$: BehaviorSubject<Asset> = new BehaviorSubject<Asset>({});
  @Input() outline: boolean = false;

  public FeedbackType = FeedbackType;
  public TEXTS = TEXTS;
  public showSomethingWentWrongError$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public showIncompleteFieldsError$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public newEntry$: BehaviorSubject<AssetValue> = new BehaviorSubject<AssetValue>({});
  public isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public displayedColumns = ['date', 'value', 'action'];
  public displayedFooterColumns = ['addDate', 'addValue', 'addAction'];
  public valueChange$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public valueChangeString$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor(
    private dataService: DataService,
  ) {}

  private fetchAsset$(): Observable<void> {
    return this.dataService.getAssetById$(this.assetId, this.isLoading$).pipe(
      map((asset: Asset) => {
        this.asset$.next(asset);
        this.valueChange$.next(123);
        this.valueChangeString$.next("123");
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
    this.showIncompleteFieldsError$.next(false);

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
          this.showIncompleteFieldsError$.next(true);
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
        const clonedAsset = structuredClone(asset);
        const newValue: AssetValue = {
          timestamp: new Date(date).valueOf().toString(),
          value: value
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
        this.showSomethingWentWrongError$.next(true);
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
        this.showSomethingWentWrongError$.next(true);
        console.log(error);
      }
    });
  }

  public getValueChange$(): Observable<number> {
    return this.dataService.getAssetById$(this.assetId).pipe(
      filter((asset: Asset) => !!asset.assetId),
      map((asset: Asset) => {
        const curValue = parseInt(asset?.curValue ?? '0');
        return curValue;
      }),
    )
  }

  public getValueChangeString$(): Observable<string> {
    return this.dataService.getAssetById$(this.assetId).pipe(
      filter((asset: Asset) => !!asset.assetId),
      map((asset: Asset) => {
        const curValue = parseInt(asset?.curValue ?? '0');
        let percentChange = 0;
        let changeSymbol;

        return changeSymbol + '$' + Math.abs((curValue)).toLocaleString() + ' (' + percentChange + '%)';
      }),
    )
  }

  public getDateString(ms: string) {
    return (new Date(ms)).toLocaleDateString();
  }
}
