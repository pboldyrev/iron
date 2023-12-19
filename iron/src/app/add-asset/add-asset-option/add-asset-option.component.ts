import { Component, Input, Output } from '@angular/core';
import { AssetType } from 'src/app/shared/constants/constants';
import { TEXTS } from './add-asset-option.strings';
import { CommonModule } from '@angular/common';
import { BluText } from 'projects/blueprint/src/lib/text/text.component';
import { BluIcon } from 'projects/blueprint/src/lib/icon/icon.component';
import { BluIconName } from 'projects/blueprint/src/lib/common/constants';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-add-asset-option',
  standalone: true,
  imports: [CommonModule, BluText, BluIcon, MatTooltipModule],
  templateUrl: './add-asset-option.component.html',
  styleUrl: './add-asset-option.component.scss'
})
export class AddAssetOptionComponent {
  @Input() type!: AssetType;

  @Input() view: 'primary' | 'secondary' = 'primary';
  @Input() disabled: boolean = false;

  public title: string = '';
  public iconName: BluIconName = AssetType.Stock;
  public layout: string = 'top';
  public TEXTS = TEXTS;

  ngOnInit() {
    switch (this.type) {
      case AssetType.Stock:
        this.title = TEXTS.STOCK_TITLE;
        this.iconName = AssetType.Stock;
        this.layout = 'top';
        break;
      case AssetType.Vehicle:
        this.title = TEXTS.VEHICLE_TITLE
        this.iconName = AssetType.Vehicle;
        this.layout = 'top';
        break;
      case AssetType.CD:
        this.title = TEXTS.CD_TITLE
        this.iconName = AssetType.CD;
        this.layout = 'bottom';
        break;
      case AssetType.HYSA:
        this.title = TEXTS.HYSA_TITLE
        this.iconName = AssetType.HYSA;
        this.layout = 'top';
        break;
      case AssetType.Custom:
        this.title = TEXTS.CUSTOM_TITLE
        this.iconName = AssetType.Custom;
        this.layout = 'top';
        break;
    }
  }
}
