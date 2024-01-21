import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { BluText } from 'projects/blueprint/src/lib/text/text.component';
import { ValueChange } from '../../constants/constants';
import { BluIcon } from 'projects/blueprint/src/lib/icon/icon.component';
import { DisplayCurrencyPipe } from "../../../../../projects/blueprint/src/lib/common/pipes/display-currency.pipe";
import { DisplayPercentPipe } from "../../../../../projects/blueprint/src/lib/common/pipes/display-percent.pipe";

@Component({
    selector: 'app-value-change',
    standalone: true,
    templateUrl: './value-change.component.html',
    styleUrl: './value-change.component.scss',
    imports: [CommonModule, BluText, BluIcon, DisplayCurrencyPipe, DisplayPercentPipe]
})
export class ValueChangeComponent {
  @Input() timeframes!: ValueChange[];
}
