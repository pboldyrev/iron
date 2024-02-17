import { CommonModule } from '@angular/common';
import { AfterContentInit, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { NetworthComponent } from '../../shared/components/networth/networth.component';
import { BluButton } from 'projects/blueprint/src/lib/button/button.component';
import { BluIcon } from 'projects/blueprint/src/lib/icon/icon.component';
import { Asset, AssetType, AssetValue, ValueChange } from '../../shared/constants/constants';
import { ValueChangeComponent } from '../../shared/components/value-change/value-change.component';
import { BluPopup } from 'projects/blueprint/src/lib/popup/popup.component';
import { AssetTableColumn, AssetTableComponent } from './asset-table/asset-table.component';
import { ConfirmationPopupComponent } from '../../shared/components/confirmation-popup/confirmation-popup.component';
import { AuthService } from '../../shared/services/auth.service';
import { AddAssetPopupComponent } from 'src/app/pages/dashboard-page/dashboard-top-bar/add-asset-popup/add-asset-popup.component';
import { DataService } from 'src/app/shared/services/data.service';
import { BehaviorSubject, Observable, Subject, filter, map, mergeMap, of, skip, startWith, take, tap } from 'rxjs';
import { BluText } from 'projects/blueprint/src/lib/text/text.component';
import { BluSpinner } from 'projects/blueprint/src/lib/spinner/spinner.component';
import { ASSET_TABLE_COLS_COLLAPSED, ASSET_TABLE_COLS_EXPANDED, ASSET_TABLE_FOOTER_COLS } from './dashboard-page.constants';
import { NavigationService } from 'src/app/shared/services/navigation-service.service';
import { Chart } from 'chart.js';
import { ChartService } from 'src/app/shared/services/chart.service';
import { LoadingStateComponent } from 'src/app/shared/components/loading-state/loading-state.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AiFeedbackComponent } from './ai-feedback/ai-feedback.component';
import { AccountSummaryComponent } from './account-summary/account-summary.component';
import { PreferencesService, USER_PREFERENCES } from 'src/app/shared/services/preferences.service';
import { BluHeading } from 'projects/blueprint/src/lib/heading/heading.component';
import { ErrorStateComponent } from 'src/app/shared/components/error-state/error-state.component';
import { SkeletonLoaderTextComponent } from 'src/app/skeleton-loader-text/skeleton-loader-text.component';
import { DashboardTopBarComponent } from './dashboard-top-bar/dashboard-top-bar.component';
import { EmptyStateComponent } from './empty-state/empty-state.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { OnboardingComponent } from './onboarding/onboarding.component';
import { Dictionary, groupBy } from 'lodash';
import { MatTabsModule } from '@angular/material/tabs';
import { BluLink } from 'projects/blueprint/src/lib/link/link.component';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, MatTabsModule, BluLink, SkeletonLoaderTextComponent, NetworthComponent, BluButton, BluIcon, ValueChangeComponent, BluPopup, AssetTableComponent, ConfirmationPopupComponent, AddAssetPopupComponent, BluText, BluSpinner, LoadingStateComponent, AiFeedbackComponent, AccountSummaryComponent, BluHeading, ErrorStateComponent, DashboardTopBarComponent, EmptyStateComponent, OnboardingComponent],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class DashboardPageComponent implements AfterContentInit {
  @ViewChild('topBar') topBar!: DashboardTopBarComponent;
  @ViewChild('assetTable') assetTable!: AssetTableComponent;
  
  public isNetworthLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public isAssetsLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public totalNetworth: number = 0;
  public networthTimeframes: ValueChange[] = [];
  public networthValues$: BehaviorSubject<AssetValue[]> = new BehaviorSubject<AssetValue[]>([]);

  public assets$ = new Observable<Asset[]>();
  public assetTableColumns: AssetTableColumn[] = [];
  public assetTableFooterColumns: AssetTableColumn[] = ASSET_TABLE_FOOTER_COLS;
  public loadingFailed = false;

  public assetsByAccount$ = new Observable<any[]>();
  public analyticsTabClicked$ = new BehaviorSubject<boolean>(false);

  dashboardChart!: Chart;

  showSidebar = (this.preferencesService.getPreference(USER_PREFERENCES.ShowSidebar) ?? 'true') === 'true';

  constructor(
    private dataService: DataService,
    private chartService: ChartService,
    private preferencesService: PreferencesService,
  ) {
    this.fetchNetWorth();
    this.fetchAssets();
  }

  ngOnInit() {
    if(this.showSidebar) {
      this.assetTableColumns = ASSET_TABLE_COLS_COLLAPSED;
    } else {
      this.assetTableColumns = ASSET_TABLE_COLS_EXPANDED;
    }
  }

  ngAfterContentInit() {
    this.networthValues$.pipe(
      skip(1),
    ).subscribe((data: AssetValue[]) => {
      if(this.dashboardChart) {
        this.dashboardChart.data = this.chartService.getDataSet(data);
        this.dashboardChart.options.borderColor = this.chartService.getBorderColor(data);
        this.dashboardChart.update();
      } else {
        this.dashboardChart = new Chart('dashboardChart', this.chartService.getOptions(data));
      }
    });
  }

  onTabChange(tab: any): void {
    if(tab.tab.textLabel === "Analytics") {
      this.analyticsTabClicked$.next(true);
    }
  }

  onAddAsset(): void {
    this.topBar.onAddAsset();
  }

  onShowSidebar(show: boolean): void {
    this.showSidebar = show;
    this.preferencesService.setPreference(USER_PREFERENCES.ShowSidebar, this.showSidebar.toString());

    if(this.showSidebar) {
      this.assetTableColumns = ASSET_TABLE_COLS_COLLAPSED;
    } else {
      this.assetTableColumns = ASSET_TABLE_COLS_EXPANDED;
    }
  }

  private fetchAssets(): void {
    this.dataService.getAssets$(this.isAssetsLoading$).pipe(
      takeUntilDestroyed(),
      tap((assets: Asset[]) => {
        this.assets$ = of(assets);
        this.assetsByAccount$ = of(this.groupBy(assets, "account"));
      }),
    ).subscribe({
      error: () => {
        this.loadingFailed = true;
      }
    });
  }

  private groupBy(arr: any[], prop: string): any[] {
    let grouped = {} as any;
    for (var i=0; i< arr.length; i++) {
      var p = arr[i][prop];
      if (!grouped[p]) { 
        grouped[p] = []; 
      }
      grouped[p].push(arr[i]);
    }
    let returnGroup = [] as {key: string, values: Observable<any[]>}[];
    Object.keys(grouped).forEach((key: string) => {
      returnGroup.push({
        key: key,
        values: grouped[key],
      });
    });
    return returnGroup.sort((a,b) => {
      if (a.key < b.key) {
      return -1;
      }
      if (a.key > b.key) {
        return 1;
      }
      return 0;
    });
  }

  private fetchNetWorth(): void {
    this.dataService.getNetWorthValues$(null, this.isNetworthLoading$).pipe(
      takeUntilDestroyed(),
      map((networthValues: AssetValue[]) => {
        if(networthValues.length > 0) {
          this.totalNetworth = networthValues[networthValues.length-1].totalValue ?? 0;
        } else {
          this.totalNetworth = 0;
        }
        this.networthValues$.next(networthValues);
        this.setValueChanges(networthValues);
      })
    ).subscribe();
  }

  private setValueChanges(networthValues: AssetValue[]): void {
    this.networthTimeframes = [];
    
    if(networthValues.length === 0) {
      return;
    }

    const allTimeChange = this.getValueChange(
      networthValues[networthValues.length-1].totalValue ?? 0,
      networthValues[0].totalValue ?? 0, "All time"
    );
    this.networthTimeframes.push(allTimeChange);

    if(networthValues.length < 2) {
      return;
    }

    const sinceLastChange = this.getValueChange(
      networthValues[networthValues.length-1].totalValue ?? 0, 
      networthValues[networthValues.length-2].totalValue ?? 0, 
      "Since " + (new Date(networthValues[networthValues.length-2].timestamp ?? 0).toLocaleDateString('en-US', {timeZone: 'UTC'}))
    );
    this.networthTimeframes.push(sinceLastChange);
  }

  private getValueChange(currentValue: number, originalValue: number, type: string): ValueChange {
    let valueChange = currentValue - originalValue;

    let percentChange: number;
    if(originalValue === 0) {
      percentChange = 0;
    } else {
      percentChange = (valueChange / originalValue) * 100
    }

    return {
      value: valueChange,
      percent: percentChange,
      type: type,
    }
  }
}