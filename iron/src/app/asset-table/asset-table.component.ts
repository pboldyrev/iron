import { Component, Input } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatMenuModule } from '@angular/material/menu';
import { Asset } from '../shared/constants/constants';
import { BluIcon } from 'projects/blueprint/src/lib/icon/icon.component';
import { BluText } from 'projects/blueprint/src/lib/text/text.component';
import { BluButton } from 'projects/blueprint/src/lib/button/button.component';
import { BehaviorSubject, Observable, combineLatest, filter, map, merge, mergeMap, of, take, tap } from 'rxjs';
import { DataService } from '../shared/services/data.service';
import { CommonModule } from '@angular/common';
import { TEXTS } from './asset-table.strings';
import { BluTag } from 'projects/blueprint/src/lib/tag/tag.component';
import { TimeRangeSelectorComponent } from '../time-range-selector/time-range-selector.component';
import { ConfirmationPopupComponent } from '../confirmation-popup/confirmation-popup.component';
import { Router } from '@angular/router';
import { BluValidationFeedback } from 'projects/blueprint/src/lib/validation-popup/validation-feedback.component';
import { FeedbackType } from 'projects/blueprint/src/lib/common/constants';
import { BluLink } from 'projects/blueprint/src/lib/link/link.component';

@Component({
  selector: 'app-asset-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule, 
    BluIcon,
    BluText,
    BluButton,
    MatProgressBarModule,
    BluTag,
    TimeRangeSelectorComponent,
    MatMenuModule,
    ConfirmationPopupComponent,
    BluValidationFeedback,
    BluLink,
  ],
  templateUrl: './asset-table.component.html',
  styleUrl: './asset-table.component.scss'
})

export class AssetTableComponent {
  @Input() showAddAsset$!: BehaviorSubject<boolean>;

  public displayedColumns = ['account', 'asset', 'units', 'initValue', 'curValue', 'change', 'edit'];
  public displayedFooterColumns = ['blankAccount', 'blankAsset', 'blankUnits', 'initValueTotal', 'curValueTotal', 'changeTotal', 'blankEdit'];
  public isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public assets$: BehaviorSubject<Asset[]> = new BehaviorSubject([] as Asset[]);
  public curTotal$: BehaviorSubject<number> = new BehaviorSubject(0);
  public initTotal$: BehaviorSubject<number> = new BehaviorSubject(0);
  public showArchivePopup$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public assetToArchive: Asset | undefined;
  public TEXTS = TEXTS;
  public FeedbackType = FeedbackType;

  public showUnknownError$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private dataChanged$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    private dataService: DataService,
    private router: Router,
  ){}

  ngOnInit() {
    this.fetchAssets$().subscribe();

    this.dataService.dataChanged$.pipe(
      mergeMap(() => {
        return this.fetchAssets$()
      })
    ).subscribe({
      next: () => {},
      error: (error) => {
        console.log(error);
        this.isLoading$.next(false);
        this.showUnknownError$.next(true);
      }
    });
  }

  public getPercentChange(init: number, cur: number): number {
    if(!init || !cur || init === 0) {
      return 0;
    }
    return Math.abs(Math.round(((cur-init) / init) * 100));
  }

  public onAddAsset(): void {
    this.showAddAsset$.next(true);
  }

  public onArchiveAsset(asset: Asset): void {
    this.showArchivePopup$.next(true);
    this.assetToArchive = asset;
  }

  public onDetailsAsset(asset: Asset): void {
    this.router.navigate(['/asset/' + asset.assetId]);
  }

  public onArchiveAssetConfirmed() {
    if(!this.assetToArchive || !this.assetToArchive.assetId) {
      console.error("Tried archiving non existent asset.");
      return;
    }

    this.dataService.archiveAsset$(this.assetToArchive.assetId, this.isLoading$).subscribe({
      next: () => {
        this.assetToArchive = undefined;
        this.dataChanged$.next(true);
      },
      error: () => {
        console.log("ERROR: COULDN'T ARCHIVE");
      }
    });
  }

  public getCurrentValueSum$(): Observable<number> {
    return this.assets$.pipe(
      map((assets: Asset[]) => {
        let total = 0;
        assets.forEach((asset: Asset) => {
          total += asset.curValue ?? 0;
        });
        return total;
      }),
    )
  }

  public getInitialValueSum$(): Observable<number> {
    return this.assets$.pipe(
      map((assets: Asset[]) => {
        let total = 0;
        assets.forEach((asset: Asset) => {
          total += asset.initValue ?? 0;
        });
        return total;
      }),
    )
  }

  public getSumPercentChange$(): Observable<number> {
    return combineLatest([
      this.getCurrentValueSum$(),
      this.getInitialValueSum$(),
    ]).pipe(
      map(([currentSum, initialSum]) => {
        if(initialSum === 0) {
          return 0;
        }
        return Math.round((currentSum-initialSum)/initialSum * 100);
      })
    )
  }

  private fetchAssets$(): Observable<void> {
    return this.dataService.getActiveAssets(this.isLoading$).pipe(
      tap((userAssets: Asset[]) => {
        let curTotal = 0;
        userAssets.forEach((asset: Asset) => {
          curTotal += asset.curValue ?? 0;
        });
        this.curTotal$.next(curTotal);
      }),
      map((userAssets: Asset[]) => {
        this.assets$.next(userAssets);
      })
    );
  }

  public onPageReload() {
    location.reload();
  }
}
