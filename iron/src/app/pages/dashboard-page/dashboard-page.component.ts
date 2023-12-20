import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { NetworthComponent } from './networth/networth.component';
import { BluButton } from 'projects/blueprint/src/lib/button/button.component';
import { BluIcon } from 'projects/blueprint/src/lib/icon/icon.component';
import { TEXTS } from './dashboard-page.strings';
import { AssetType, AssetValue, ValueChange } from '../../shared/constants/constants';
import { AssetTypeCardComponent } from './asset-type-card/asset-type-card.component';
import { ValueChangeComponent } from './value-change/value-change.component';
import { AddAssetComponent } from '../../add-asset/add-asset.component';
import { BluPopup } from 'projects/blueprint/src/lib/popup/popup.component';
import { ChartComponent } from '../../chart/networth-chart.component';
import { AssetTableComponent } from '../../asset-table/asset-table.component';
import { ConfirmationPopupComponent } from '../../shared/components/confirmation-popup/confirmation-popup.component';
import { AuthService } from '../../shared/services/auth.service';
import { AddAssetPopupComponent } from 'src/app/add-asset-popup/add-asset-popup.component';
import { DataService } from 'src/app/shared/services/data.service';
import { BehaviorSubject, mergeMap } from 'rxjs';

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
  public valueChangeAllTime$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public networthChangeTimeframes$: BehaviorSubject<ValueChange[]> = new BehaviorSubject<ValueChange[]>([]);

  constructor(
    private authService: AuthService,
    private dataService: DataService,
  ) {}

  ngOnInit() {
    this.dataService.getHistoricalNetWorth$(null, this.isLoading$)
    .subscribe({
      next: (historicalNetworth: AssetValue[]) => {
        const latest = historicalNetworth[historicalNetworth.length-1].value ?? 0;
        const oldest = historicalNetworth[0].value ?? 0;
        this.totalNetworth$.next(historicalNetworth[historicalNetworth.length-1].value ?? 0);
        this.historicalNetworth$.next(historicalNetworth);

        let timeframes: ValueChange[] = [
          {
            type: "All time",
            value: latest-oldest,
            percent: (latest-oldest)/oldest * 100,
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
        this.totalNetworth$.next(historicalNetworth[historicalNetworth.length-1].value ?? 0);
      },
      error: (error) => {
        console.log(error);
        this.isLoading$.next(false);
      }
    });
  }

  public assetSummaries = [
    {
      type: AssetType.Stock,
      valueChange: [{
        type: "All time",
        value: 500.69,
        percent: 60,
      }],
    },
    {
      type: AssetType.Vehicle,
      valueChange: [{
        type: "All time",
        value: 500.69,
        percent: 60,
      }],
    },
    {
      type: AssetType.HYSA,
      valueChange: [{
        type: "All time",
        value: 500.69,
        percent: 60,
      }],
    }
  ];

  public onAddAsset(): void {
    this.addAssetPopup.show();
  }

  public onLogOut(): void {
    this.authService.signOut();
  }
}
