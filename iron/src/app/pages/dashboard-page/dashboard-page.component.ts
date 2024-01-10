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
import { AddAssetPopupComponent } from 'src/app/add-asset-selection/add-asset-popup/add-asset-popup.component';
import { DataService } from 'src/app/shared/services/data.service';
import { BehaviorSubject, Observable, filter, map, mergeMap, of, skip, take, tap } from 'rxjs';
import { BluText } from 'projects/blueprint/src/lib/text/text.component';
import { BluSpinner } from 'projects/blueprint/src/lib/spinner/spinner.component';
import { ASSET_TABLE_COLS } from './dashboard-page.constants';
import { FooterComponent } from 'src/app/footer/footer.component';
import { NavigationService } from 'src/app/shared/services/navigation-service.service';
import { Chart } from 'chart.js';
import { ChartService } from 'src/app/shared/services/chart.service';
import { LoadingStateComponent } from 'src/app/loading-state/loading-state.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, NetworthComponent, BluButton, BluIcon, ValueChangeComponent, BluPopup, AssetTableComponent, ConfirmationPopupComponent, AddAssetPopupComponent, BluText, BluSpinner, FooterComponent, LoadingStateComponent],
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
        this.dashboardChart.data = this.chartService.getDataSet('dashboardChart', data);
        this.dashboardChart.options.borderColor = this.chartService.getBorderColor(data);
        this.dashboardChart.update();
      } else {
        this.dashboardChart = new Chart('dashboardChart', this.chartService.getOptions('dashboardChart', data));
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

  onRefresh(): void {
    this.dataService.dataChanged$.next(true);
  }

  public onConfirmLogOut(): void {
    this.authService.signOut();
  }

  private fetchAssets(): void {
    this.dataService.getAssets$(this.isAssetsLoading$).pipe(
      takeUntilDestroyed(),
      map((assets: Asset[]) => {
        this.assets$.next(assets);
        this.updateAssetTypeSummaries$(assets);
      }),
    ).subscribe();
  }

  private updateAssetTypeSummaries$(assets: Asset[]): Observable<void> {
    let assetsAndValues: any = {};

    assets.map(asset => {
      if (assetsAndValues[(asset.assetType ?? "")] === undefined) {
        assetsAndValues[(asset.assetType ?? "")] = 0;
      } else {
        assetsAndValues[(asset.assetType ?? "")] += asset.curTotalValue;
      }
    })

    Object.keys(assetsAndValues).forEach((key: string) => {
    });

    return of();
  }

  private fetchNetWorth(): void {
    this.dataService.getNetWorthValues$(null, this.isNetworthLoading$).pipe(takeUntilDestroyed())
    .subscribe((networthValues: AssetValue[]) => {
        this.setValueChanges(networthValues);
        
        if(networthValues.length > 0) {
          this.totalNetworth = networthValues[networthValues.length-1].totalValue ?? 0;
        } else {
          this.totalNetworth = 0;
        }

        this.networthValues$.next(networthValues);
      },
    );
  }

  private setValueChanges(networthValues: AssetValue[]): void {
    if(networthValues.length === 0) {
      return;
    }

    this.networthTimeframes = [];
    const allTimeChange = this.getValueChange(networthValues[networthValues.length-1].totalValue ?? 0, networthValues[0].totalValue ?? 0, "All time");
    this.networthTimeframes.push(allTimeChange);

    if(networthValues.length < 2) {
      return;
    }

    const sinceLastChange = this.getValueChange(
      networthValues[networthValues.length-1].totalValue ?? 0, 
      networthValues[networthValues.length-2].totalValue ?? 0, 
      "Since " + (new Date(networthValues[networthValues.length-2].timestamp ?? 0).toLocaleDateString('en-US', {timeZone: 'UTC'})));
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