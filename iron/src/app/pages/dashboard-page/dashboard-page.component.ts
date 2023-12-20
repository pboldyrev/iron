import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { NetworthComponent } from './networth/networth.component';
import { BluButton } from 'projects/blueprint/src/lib/button/button.component';
import { BluIcon } from 'projects/blueprint/src/lib/icon/icon.component';
import { TEXTS } from './dashboard-page.strings';
import { Asset, AssetType, AssetValue, ValueChange } from '../../shared/constants/constants';
import { AssetTypeCardComponent, AssetTypeSummary } from './asset-type-card/asset-type-card.component';
import { ValueChangeComponent } from './value-change/value-change.component';
import { AddAssetComponent } from '../../add-asset/add-asset.component';
import { BluPopup } from 'projects/blueprint/src/lib/popup/popup.component';
import { ChartComponent } from '../../chart/networth-chart.component';
import { AssetTableColumn, AssetTableComponent } from '../../asset-table/asset-table.component';
import { ConfirmationPopupComponent } from '../../shared/components/confirmation-popup/confirmation-popup.component';
import { AuthService } from '../../shared/services/auth.service';
import { AddAssetPopupComponent } from 'src/app/add-asset-popup/add-asset-popup.component';
import { DataService } from 'src/app/shared/services/data.service';
import { BehaviorSubject, Observable, mergeMap, tap } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, NetworthComponent, BluButton, BluIcon, AssetTypeCardComponent, ValueChangeComponent, BluPopup, ChartComponent, AssetTableComponent, ConfirmationPopupComponent, AddAssetPopupComponent],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss'
})
export class DashboardPageComponent {
  @ViewChild('addAssetPopup') addAssetPopup!: AddAssetPopupComponent;
  
  public TEXTS = TEXTS;
  public isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public totalNetworth$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public historicalNetworth$: BehaviorSubject<AssetValue[]> = new BehaviorSubject<AssetValue[]>([]);
  public networthChangeTimeframes$: BehaviorSubject<ValueChange[]> = new BehaviorSubject<ValueChange[]>([]);

  public assets$: BehaviorSubject<Asset[]> = new BehaviorSubject<Asset[]>([]);
  public assetSummaries$: BehaviorSubject<AssetTypeSummary[]> = new BehaviorSubject<AssetTypeSummary[]>([]);
  public assetTableColumns: AssetTableColumn[] = ['type', 'asset', 'curValue', 'edit'];

  constructor(
    private authService: AuthService,
    private dataService: DataService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.fetchNetWorth();
    this.fetchAssets();

    this.assets$.subscribe((assets: Asset[]) => {
      this.assetSummaries$.next(assets.map((asset: Asset) => {
        return {
          type: asset.assetType as AssetType,
          valueChange: [
            {
              type: "All time",
              value: 500.10,
              percent: 10,
            },
            {
              type: "Since Dec 18, 2023",
              value: -100.10,
              percent: 50,
            }
          ]
        }
      }));
    });
  }

  public onAddAsset(): void {
    this.addAssetPopup.show();
  }

  public onLogOut(): void {
    this.authService.signOut();
  }

  private fetchAssets(): void {
    this.dataService.getActiveAssets$(this.isLoading$).subscribe({
      next: (assets: Asset[]) => {
        this.assets$.next(assets);
      },
      error: (error) => {
        console.log(error);
        this.isLoading$.next(false);
      }
    });

    this.dataService.dataChanged$.pipe(
      mergeMap(() => {
        return this.dataService.getActiveAssets$(this.isLoading$)
      })
    ).subscribe({
      next: (assets: Asset[]) => {
        this.assets$.next(assets);
      },
      error: (error) => {
        console.log(error);
        this.isLoading$.next(false);
      }
    });
  }

  private fetchNetWorth(): void {
    this.dataService.getHistoricalNetWorth$(null, this.isLoading$)
    .subscribe({
      next: (historicalNetworth: AssetValue[]) => {
        this.setHistoricalNetWorth(historicalNetworth);
      },
      error: (error) => {
        console.log(error);
        this.isLoading$.next(false);
      }
    });

    this.dataService.dataChanged$.pipe(
      mergeMap(() => {
        return this.dataService.getHistoricalNetWorth$(null, this.isLoading$)
      })
    ).subscribe({
      next: (historicalNetworth: AssetValue[]) => {
        this.setHistoricalNetWorth(historicalNetworth);
      },
      error: (error) => {
        console.log(error);
        this.isLoading$.next(false);
      }
    });
  }

  private setHistoricalNetWorth(historicalNetworth: AssetValue[]) {
    const latest = historicalNetworth[historicalNetworth.length-1].value ?? 0;
    const oldest = historicalNetworth[0].value ?? 0;
    this.totalNetworth$.next(historicalNetworth[historicalNetworth.length-1].value ?? 0);
    this.historicalNetworth$.next(historicalNetworth);

    let timeframes: ValueChange[] = [
      {
        type: "All time",
        value: latest-oldest,
        percent: oldest > 0 ? (latest-oldest)/oldest * 100 : 0,
      }
    ];

    if(historicalNetworth.length > 1) {
      let secondLatest = historicalNetworth[historicalNetworth.length-2].value ?? 0;
      let secondLatestDate = new Date(historicalNetworth[historicalNetworth.length-2].timestamp ?? 0).toLocaleDateString('en-US', {month: 'short', year: 'numeric', day: 'numeric'});
      timeframes.push(
        {
          type: "Since " + secondLatestDate,
          value: latest-secondLatest,
          percent: (latest-secondLatest)/secondLatest * 100,
        }
      );
    }
    this.networthChangeTimeframes$.next(timeframes);
  }
}
