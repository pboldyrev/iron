import { Component, Input, ViewChild } from '@angular/core';
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
import { ConfirmationPopupComponent } from '../shared/components/confirmation-popup/confirmation-popup.component';
import { Router } from '@angular/router';
import { BluValidationFeedback } from 'projects/blueprint/src/lib/validation-popup/validation-feedback.component';
import { FeedbackType } from 'projects/blueprint/src/lib/common/constants';
import { BluLink } from 'projects/blueprint/src/lib/link/link.component';
import { AddAssetPopupComponent } from '../add-asset-popup/add-asset-popup.component';

export type AssetTableColumn = 
  "account" | 
  "type" | 
  "asset" | 
  "units" | 
  "initValue" | 
  "curValue" | 
  "edit" | 
  "change";

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
    MatMenuModule,
    ConfirmationPopupComponent,
    BluValidationFeedback,
    BluLink,
    AddAssetPopupComponent,
  ],
  templateUrl: './asset-table.component.html',
  styleUrl: './asset-table.component.scss'
})

export class AssetTableComponent {
  @ViewChild('archiveConfirmPopup') archiveConfirmPopup!: ConfirmationPopupComponent;
  @ViewChild('addAssetPopup') addAssetPopup!: AddAssetPopupComponent;

  @Input() columns!: AssetTableColumn[];
  @Input() assets$!: BehaviorSubject<Asset[]>;
  @Input() isLoading$!: BehaviorSubject<boolean>;

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

  public getPercentChange(init: number, cur: number): number {
    if(!init || !cur || init === 0) {
      return 0;
    }
    return Math.abs(Math.round(((cur-init) / init) * 100));
  }
  public onArchiveAsset(asset: Asset): void {
    this.archiveConfirmPopup.show();
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
        this.isLoading$.next(false);
      },
      error: () => {
        console.log("ERROR: COULDN'T ARCHIVE");
        this.isLoading$.next(false);
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

  public onAddAsset(): void {
    this.addAssetPopup.show();
  }

  public onPageReload() {
    location.reload();
  }
}
