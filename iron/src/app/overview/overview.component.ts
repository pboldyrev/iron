import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../shared/services/auth.service';
import { AssetTableComponent } from '../asset-table/asset-table.component';
import { BluHeading } from 'projects/blueprint/src/lib/heading/heading.component';
import { TEXTS } from './overview.strings';
import { BluModal } from 'projects/blueprint/src/lib/modal/modal.component';
import { BluPopup } from 'projects/blueprint/src/lib/popup/popup.component';
import { BehaviorSubject } from 'rxjs';
import { AddAssetComponent } from '../add-asset/add-asset.component';
import { NetworthComponent } from '../networth/networth.component';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, AssetTableComponent, BluHeading, BluModal, BluPopup, AddAssetComponent, NetworthComponent],
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent {
  public TEXTS = TEXTS;
  public userId: string = this.authService.getCurrentUserId();
  public showAddAsset$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private authService: AuthService) {}
}
