import { CommonModule } from '@angular/common';
import { AfterContentInit, Component, ViewChild } from '@angular/core';
import { NetworthComponent } from '../../shared/components/networth/networth.component';
import { BluButton } from 'projects/blueprint/src/lib/button/button.component';
import { BluIcon } from 'projects/blueprint/src/lib/icon/icon.component';
import { TEXTS } from './dashboard-page.strings';
import { Asset, AssetType, AssetValue, ValueChange } from '../../shared/constants/constants';
import { ValueChangeComponent } from '../../shared/components/value-change/value-change.component';
import { BluPopup } from 'projects/blueprint/src/lib/popup/popup.component';
import { AssetTableColumn, AssetTableComponent } from './asset-table/asset-table.component';
import { ConfirmationPopupComponent } from '../../shared/components/confirmation-popup/confirmation-popup.component';
import { AuthService } from '../../shared/services/auth.service';
import { AddAssetPopupComponent } from 'src/app/pages/add-asset-page/add-asset-selection/add-asset-popup/add-asset-popup.component';
import { DataService } from 'src/app/shared/services/data.service';
import { BehaviorSubject, Observable, filter, map, mergeMap, of, skip, take, tap } from 'rxjs';
import { BluText } from 'projects/blueprint/src/lib/text/text.component';
import { BluSpinner } from 'projects/blueprint/src/lib/spinner/spinner.component';
import { ASSET_TABLE_COLS } from './dashboard-page.constants';
import { NavigationService } from 'src/app/shared/services/navigation-service.service';
import { Chart } from 'chart.js';
import { ChartService } from 'src/app/shared/services/chart.service';
import { LoadingStateComponent } from 'src/app/shared/components/loading-state/loading-state.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AiFeedbackComponent } from './ai-feedback/ai-feedback.component';
import { AccountSummaryComponent } from './account-summary/account-summary.component';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, NetworthComponent, BluButton, BluIcon, ValueChangeComponent, BluPopup, AssetTableComponent, ConfirmationPopupComponent, AddAssetPopupComponent, BluText, BluSpinner, LoadingStateComponent, AiFeedbackComponent, AccountSummaryComponent],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss'
})
export class DashboardPageComponent implements AfterContentInit {
  @ViewChild('addAssetPopup') addAssetPopup!: AddAssetPopupComponent;
  @ViewChild('logOutConfirmPopup') logOutConfirmPopup!: ConfirmationPopupComponent;
  @ViewChild('assetTable') assetTable!: AssetTableComponent;
  
  public TEXTS = TEXTS;
  public isNetworthLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public isAssetsLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public totalNetworth: number = 0;
  public networthTimeframes: ValueChange[] = [];
  public networthValues$: BehaviorSubject<AssetValue[]> = new BehaviorSubject<AssetValue[]>([]);

  public assets$ = new BehaviorSubject([] as Asset[]);
  public assetTableColumns: AssetTableColumn[] = ASSET_TABLE_COLS;

  dashboardChart!: Chart;

  constructor(
    private authService: AuthService,
    private dataService: DataService,
    private navigationService: NavigationService,
    private chartService: ChartService,
  ) {
    this.fetchNetWorth();
    this.fetchAssets();
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

  onAddAsset(): void {
    this.addAssetPopup.show();
  }

  onSettings(): void {
    this.navigationService.navigate('/settings');
  }

  onLogOut(): void {
    this.logOutConfirmPopup.show();
  }

  onConfirmLogOut(): void {
    this.authService.signOut();
  }

  onFeedback(): void {
    location.href = "mailto:feedback@finacle.app?subject=Finacle app feedback"
  }

  private fetchAssets(): void {
    this.dataService.getAssets$(this.isAssetsLoading$).pipe(
      takeUntilDestroyed(),
      map((assets: Asset[]) => {
        this.assets$.next(assets);
      }),
    ).subscribe();
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