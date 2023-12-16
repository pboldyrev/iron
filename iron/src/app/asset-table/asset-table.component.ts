import { Component, Input } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatMenuModule } from '@angular/material/menu';
import { Asset } from '../shared/constants/constants';
import { BluIcon } from 'projects/blueprint/src/lib/icon/icon.component';
import { BluText } from 'projects/blueprint/src/lib/text/text.component';
import { BluButton } from 'projects/blueprint/src/lib/button/button.component';
import { BehaviorSubject, take, tap } from 'rxjs';
import { DataService } from '../shared/services/data.service';
import { CommonModule } from '@angular/common';
import { TEXTS } from './asset-table.strings';
import { BluTag } from 'projects/blueprint/src/lib/tag/tag.component';
import { TimeRangeSelectorComponent } from '../time-range-selector/time-range-selector.component';
import { ConfirmationPopupComponent } from '../confirmation-popup/confirmation-popup.component';
import { Router } from '@angular/router';

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
  ],
  templateUrl: './asset-table.component.html',
  styleUrl: './asset-table.component.scss'
})

export class AssetTableComponent {
  @Input() userId!: string;
  @Input() showAddAsset$!: BehaviorSubject<boolean>;

  public displayedColumns = ['account', 'asset', 'units', 'initValue', 'curValue', 'change', 'edit'];
  public displayedFooterColumns = ['blankAccount', 'blankAsset', 'blankUnits', 'initValueTotal', 'curValueTotal', 'changeTotal', 'blankEdit'];
  public isLoading$ = new BehaviorSubject<boolean>(false);
  public assets$: BehaviorSubject<Asset[]> = new BehaviorSubject([] as Asset[]);
  public curTotal$: BehaviorSubject<number> = new BehaviorSubject(0);
  public initTotal$: BehaviorSubject<number> = new BehaviorSubject(0);
  public showArchivePopup$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public assetToArchive: Asset | undefined;
  public TEXTS = TEXTS;

  constructor(
    private dataService: DataService,
    private router: Router,
  ){}

  ngOnInit() {
    this.fetchAssets();
    this.dataService.dataChanged$.pipe(tap(() => {
      this.fetchAssets();
    })).subscribe();
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
    this.router.navigate(['/asset/' + asset.id + '/value-history']);
  }

  public onArchiveAssetConfirmed() {
    if(this.assetToArchive) {
      this.dataService.archiveAsset$(this.userId, this.assetToArchive)
      .subscribe((archiveSuccess: boolean) => {
        if(archiveSuccess) {
          this.assetToArchive = undefined;
        } else {
          console.log("ERROR: COULDN'T ARCHIVE");
        }
      });
    }
  }

  private fetchAssets(): void {
    this.isLoading$.next(true);
    this.dataService.getUserAssets$(this.userId)
    .subscribe((userAssets: Asset[]) => {
      this.assets$.next(userAssets);
      this.isLoading$.next(false);
    });

    this.assets$.subscribe((userAssets: Asset[]) => {
      let assetInitTotal = 0;
      let assetCurTotal = 0;

      userAssets.forEach((asset: Asset) => {
        assetInitTotal += asset.initValue ?? 0;
        assetCurTotal += asset.curValue ?? 0;
      });

      this.initTotal$.next(assetInitTotal);
      this.curTotal$.next(assetCurTotal);
    });
  }
}
