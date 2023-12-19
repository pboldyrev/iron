import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { NetworthComponent } from './networth/networth.component';
import { BluButton } from 'projects/blueprint/src/lib/button/button.component';
import { BluIcon } from 'projects/blueprint/src/lib/icon/icon.component';
import { TEXTS } from './dashboard-page.strings';
import { AssetType, ValueChange } from '../../shared/constants/constants';
import { AssetTypeCardComponent } from './asset-type-card/asset-type-card.component';
import { ValueChangeComponent } from './value-change/value-change.component';
import { AddAssetComponent } from '../../add-asset/add-asset.component';
import { BluPopup } from 'projects/blueprint/src/lib/popup/popup.component';
import { ChartComponent } from '../../chart/chart.component';
import { AssetTableComponent } from '../../asset-table/asset-table.component';
import { ConfirmationPopupComponent } from '../../shared/components/confirmation-popup/confirmation-popup.component';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, NetworthComponent, BluButton, BluIcon, AssetTypeCardComponent, ValueChangeComponent, AddAssetComponent, BluPopup, ChartComponent, AssetTableComponent, ConfirmationPopupComponent],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss'
})
export class DashboardPageComponent {
  @ViewChild('addAssetPopup') addAssetPopup!: BluPopup;
  
  public TEXTS = TEXTS;

  constructor(
    private authService: AuthService
  ) {}

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

  public onAddAsset(): void {
    this.addAssetPopup.show();
  }

  public onLogOut(): void {
    this.authService.signOut();
  }
}