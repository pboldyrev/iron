import { CommonModule, Location } from '@angular/common';
import {
  AfterContentInit,
  Component,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ValueHistoryComponent } from './value-history/value-history.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { BluButton } from 'projects/blueprint/src/lib/button/button.component';
import { BluModal } from 'projects/blueprint/src/lib/modal/modal.component';
import {
  BehaviorSubject,
  Observable,
  Subject,
  combineLatest,
  filter,
  last,
  map,
  mergeMap,
  of,
  skip,
  take,
  takeUntil,
  tap,
} from 'rxjs';
import { DataService } from '../../shared/services/data.service';
import { Asset, AssetType, AssetValue } from '../../shared/constants/constants';
import { BluSpinner } from 'projects/blueprint/src/lib/spinner/spinner.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AssetMoreDetailsComponent } from './asset-more-details/asset-more-details.component';
import { BluHeading } from 'projects/blueprint/src/lib/heading/heading.component';
import { BluText } from 'projects/blueprint/src/lib/text/text.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationService } from 'src/app/shared/services/navigation-service.service';
import { Chart } from 'chart.js';
import { ChartService } from 'src/app/shared/services/chart.service';
import { BluLabel } from 'projects/blueprint/src/lib/label/label.component';
import { BluLink } from 'projects/blueprint/src/lib/link/link.component';
import { BluInput } from 'projects/blueprint/src/lib/input/input.component';
import { FeedbackType } from 'projects/blueprint/src/lib/common/constants';
import { BluSelect } from 'projects/blueprint/src/lib/select/select.component';
import { LoadingStateComponent } from 'src/app/shared/components/loading-state/loading-state.component';
import { FutureProjectionComponent } from 'src/app/pages/asset-details-page/future-projection/future-projection.component';
import { TEXTS } from './asset-details-page.strings';
import { DisplayCurrencyPipe } from '../../../../projects/blueprint/src/lib/common/pipes/display-currency.pipe';
import { SkeletonLoaderTextComponent } from 'src/app/skeleton-loader-text/skeleton-loader-text.component';
import { DateService } from 'src/app/shared/services/date.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { BluTag } from 'projects/blueprint/src/lib/tag/tag.component';

@Component({
  selector: 'app-asset-details-page',
  standalone: true,
  templateUrl: './asset-details-page.component.html',
  styleUrl: './asset-details-page.component.scss',
  encapsulation: ViewEncapsulation.None,
  imports: [
    SkeletonLoaderTextComponent,
    CommonModule,
    ValueHistoryComponent,
    MatTabsModule,
    BluButton,
    BluModal,
    BluSpinner,
    MatProgressBarModule,
    AssetMoreDetailsComponent,
    BluSpinner,
    BluHeading,
    BluText,
    BluLabel,
    BluLink,
    BluInput,
    BluSelect,
    LoadingStateComponent,
    FutureProjectionComponent,
    DisplayCurrencyPipe,
    BluTag,
  ],
})
export class AssetDetailsPageComponent implements AfterContentInit {
  @ViewChild('futureProjection') futureProjection!: FutureProjectionComponent;
  @ViewChild('valueHistory') valueHistory!: ValueHistoryComponent;
  AssetType = AssetType;
  FeedbackType = FeedbackType;
  TEXTS = TEXTS;

  asset$ = new BehaviorSubject<Asset>({});
  assetId = '';
  assetValues$ = new BehaviorSubject<AssetValue[]>([]);

  isValuesLoading$ = new BehaviorSubject<boolean>(false);
  isAssetLoading$ = new BehaviorSubject<boolean>(false);
  isLoading$ = combineLatest([
    this.isValuesLoading$,
    this.isAssetLoading$,
  ]).pipe(
    map(([isValuesLoading, isAssetLoading]) => {
      return !isValuesLoading && !isAssetLoading;
    }),
  );
  isArchiving$ = new BehaviorSubject<boolean>(false);

  displayAssetName = '';

  constructor(
    private navigationService: NavigationService,
    private route: ActivatedRoute,
    private dataService: DataService,
    private dateService: DateService,
    private toastService: ToastService,
  ) {
    const curId: string = this.navigationService.getUrlParam(this.route, 'id');
    this.assetId = curId;
    this.fetchAssetValue(curId);
    this.fetchValueHistory(curId);
  }

  ngAfterContentInit() {
    this.assetValues$.pipe(skip(1)).subscribe((data: AssetValue[]) => {
      this.valueHistory.updateChart(data);
    });
  }

  onTabClick(tab: MatTabChangeEvent) {
    if (tab.tab.textLabel === TEXTS.TAB_HISTORICAL) {
      this.assetValues$.pipe(take(1)).subscribe((data: AssetValue[]) => {
        this.valueHistory.updateChart(data);
      });
    }
    if (tab.tab.textLabel === TEXTS.TAB_PROJECTION) {
      this.futureProjection.updateChart();
    }
  }

  private fetchAssetValue(assetId: string): void {
    this.dataService
      .getAssetById$(assetId, this.isAssetLoading$)
      .pipe(
        takeUntilDestroyed(),
        map((asset: Asset) => {
          this.asset$.next(asset);
          this.displayAssetName = this.getDisplayName(asset);
        }),
      )
      .subscribe();
  }

  private fetchValueHistory(assetId: string): void {
    this.dataService
      .getAssetValues$(assetId, this.isValuesLoading$)
      .pipe(
        takeUntilDestroyed(),
        map((assetValues: AssetValue[]) => {
          this.assetValues$.next(assetValues);
        }),
      )
      .subscribe();
  }

  onBack() {
    this.navigationService.back();
  }

  onRefresh() {
    this.dataService.dataChanged$.next(true);
  }

  onArchiveAsset(): void {
    this.isArchiving$.next(true);
    let lastDate = this.dateService.getLatestValidDate();
    lastDate.setDate(lastDate.getDate() - 1);
    this.dataService
      .putAssetValue$(this.assetId, {
        timestamp: lastDate.getTime(),
        units: 0,
        totalValue: 0,
      })
      .pipe(
        mergeMap(() =>
          this.dataService.archiveAsset$(this.assetId, this.isArchiving$),
        ),
      )
      .subscribe(() => {
        this.navigationService.navigate('/');
        this.toastService.showToast(
          'Successfully archived asset!',
          FeedbackType.SUCCESS,
        );
      });
  }

  private getDisplayName(asset: Asset): string {
    let finalName = '';

    if (asset.assetType) {
      finalName += this.capitalizeFirstLetter(asset.assetType) + ' - ';
    }

    if (asset.assetName) {
      finalName += asset.assetName;
    }

    if (asset.nickName) {
      finalName += ' (' + asset.nickName + ')';
    }

    return finalName;
  }

  private capitalizeFirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
