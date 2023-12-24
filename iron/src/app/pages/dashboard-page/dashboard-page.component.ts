import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { NetworthComponent } from './networth/networth.component';
import { BluButton } from 'projects/blueprint/src/lib/button/button.component';
import { BluIcon } from 'projects/blueprint/src/lib/icon/icon.component';
import { TEXTS } from './dashboard-page.strings';
import { Asset, AssetType, AssetValue, NetWorthValue, ValueChange } from '../../shared/constants/constants';
import { AssetTypeCardComponent, AssetTypeSummary } from './asset-type-card/asset-type-card.component';
import { ValueChangeComponent } from './value-change/value-change.component';
import { AddAssetComponent } from '../../add-asset/add-asset.component';
import { BluPopup } from 'projects/blueprint/src/lib/popup/popup.component';
import { ChartComponent } from '../../shared/components/chart/chart.component';
import { AssetTableColumn, AssetTableComponent } from '../../asset-table/asset-table.component';
import { ConfirmationPopupComponent } from '../../shared/components/confirmation-popup/confirmation-popup.component';
import { AuthService } from '../../shared/services/auth.service';
import { AddAssetPopupComponent } from 'src/app/add-asset-popup/add-asset-popup.component';
import { DataService } from 'src/app/shared/services/data.service';
import { BehaviorSubject, Observable, filter, map, mergeMap, of, tap } from 'rxjs';
import { Router } from '@angular/router';
import { BluText } from 'projects/blueprint/src/lib/text/text.component';
import { BluSpinner } from 'projects/blueprint/src/lib/spinner/spinner.component';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, NetworthComponent, BluButton, BluIcon, AssetTypeCardComponent, ValueChangeComponent, BluPopup, ChartComponent, AssetTableComponent, ConfirmationPopupComponent, AddAssetPopupComponent, BluText, BluSpinner],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss'
})
export class DashboardPageComponent {
  @ViewChild('addAssetPopup') addAssetPopup!: AddAssetPopupComponent;
  @ViewChild('logOutConfirmPopup') logOutConfirmPopup!: ConfirmationPopupComponent;
  
  public TEXTS = TEXTS;
  public isNetWorthLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public isTableLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public totalNetworth: number = 0;
  public networthTimeframes: ValueChange[] = [];
  public networthValues$: BehaviorSubject<AssetValue[]> = new BehaviorSubject<AssetValue[]>([]);

  public assets$: BehaviorSubject<Asset[]> = new BehaviorSubject<Asset[]>([]);
  public assetSummaries: AssetTypeSummary[] = [];
  public assetTableColumns: AssetTableColumn[] = ['type', 'asset', 'curValue', 'edit'];

  constructor(
    private authService: AuthService,
    private dataService: DataService,
  ) {}

  ngOnInit() {
    this.fetchNetWorth();
    this.fetchAssets();
  }

  public onAddAsset(): void {
    this.addAssetPopup.show();
  }

  public onLogOut(): void {
    this.logOutConfirmPopup.show();
  }

  public onConfirmLogOut(): void {
    this.authService.signOut();
  }

  private fetchAssets(): void {
    this.dataService.getAssets$(false, this.isTableLoading$).pipe(
      tap((assets: Asset[]) => {
        this.updateAssetTypeSummaries$(assets);
      }),
      map((assets: Asset[]) => {
        this.assets$.next(assets);
      }),
    ).subscribe();
  }

  private updateAssetTypeSummaries$(assets: Asset[]): Observable<void> {
    const assetTypes: AssetType[] = [...new Set(assets.map(asset => (asset.assetType ?? "") as AssetType)) ]
    this.assetSummaries = [];

    assetTypes.forEach((type: AssetType) => {
      this.assetSummaries.push({
        type: type,
        total: 123,
        valueChange: [
          {
            type: "All time",
            value: 1200,
            percent: 14,
          }
        ]
      })
    });
    return of();
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

  private fetchNetWorth(): void {
    this.dataService.getNetWorthValues$(null, this.isNetWorthLoading$)
    .subscribe((networthValues: NetWorthValue[]) => {
        if(networthValues.length > 0) {
          this.networthTimeframes = [];
          const allTimeChange = this.getValueChange(networthValues[networthValues.length-1].netWorth ?? 0, networthValues[0].netWorth ?? 0, "All time");
          this.networthTimeframes.push(allTimeChange);

          if(networthValues.length > 1){
            const sinceLastChange = this.getValueChange(
              networthValues[networthValues.length-1].netWorth ?? 0, 
              networthValues[networthValues.length-2].netWorth ?? 0, 
              "Since " + (new Date(networthValues[networthValues.length-2].timestamp ?? 0).toLocaleDateString('en-US', {timeZone: 'UTC'})));
            this.networthTimeframes.push(sinceLastChange);
          }
          this.totalNetworth = networthValues[networthValues.length-1].netWorth ?? 0;
        } else {
          this.totalNetworth = 0;
        }
        this.networthValues$.next(networthValues.map((nw: NetWorthValue) => {
          return {
            timestamp: nw.timestamp,
            value: nw.netWorth
          }
        }));
      },
    );
  }
}