import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NetworthComponent } from '../networth/networth.component';
import { BluButton } from 'projects/blueprint/src/lib/button/button.component';
import { BluIcon } from 'projects/blueprint/src/lib/icon/icon.component';
import { TEXTS } from './dashboard.strings';
import { AssetType, ValueChange } from '../shared/constants/constants';
import { AssetSummaryComponent } from '../asset-summary/asset-summary.component';
import { ValueChangeComponent } from '../value-change/value-change.component';
import { AddAssetComponent } from '../add-asset/add-asset.component';
import { BluPopup } from 'projects/blueprint/src/lib/popup/popup.component';
import { BehaviorSubject } from 'rxjs';
import { ChartComponent } from '../chart/chart.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NetworthComponent, BluButton, BluIcon, AssetSummaryComponent, ValueChangeComponent, AddAssetComponent, BluPopup, ChartComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  public showAddAsset$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public TEXTS = TEXTS;

  public networthChangeTimeframes: ValueChange[] = [
    {
      type: "Day",
      value: -100.54,
      percent: 10,
    },
    {
      type: "All time",
      value: 500.69,
      percent: 60,
    }
  ];

  public assetSummaries = [
    {
      type: AssetType.Stock,
      valueChange: this.networthChangeTimeframes,
    },
    {
      type: AssetType.Vehicle,
      valueChange: this.networthChangeTimeframes,
    },
    {
      type: AssetType.HYSA,
      valueChange: this.networthChangeTimeframes,
    }
  ];

  public onAddAsset() {
    this.showAddAsset$.next(true);
  }
}
