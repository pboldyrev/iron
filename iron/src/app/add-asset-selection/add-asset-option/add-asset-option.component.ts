import { Component, Input } from '@angular/core';
import { AssetType } from 'src/app/shared/constants/constants';
import { TEXTS } from './add-asset-option.strings';
import { CommonModule } from '@angular/common';
import { BluText } from 'projects/blueprint/src/lib/text/text.component';
import { BluIcon } from 'projects/blueprint/src/lib/icon/icon.component';
import { BluIconName } from 'projects/blueprint/src/lib/common/constants';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AssetToNameMap } from './add-asset-option.constants';

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
    this.title = AssetToNameMap[this.type];
    this.iconName = this.type;
    this.layout = 'top';
  }
}
