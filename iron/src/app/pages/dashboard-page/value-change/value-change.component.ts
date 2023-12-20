import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { BluText } from 'projects/blueprint/src/lib/text/text.component';
import { ValueChange } from '../../../shared/constants/constants';
import { BluIcon } from 'projects/blueprint/src/lib/icon/icon.component';

@Component({
  selector: 'app-value-change',
  standalone: true,
  imports: [CommonModule, BluText, BluIcon],
  templateUrl: './value-change.component.html',
  styleUrl: './value-change.component.scss'
})
export class ValueChangeComponent {
  @Input() timeframes!: ValueChange[];

  public getDisplayString(valueChange: ValueChange): string {
    let finalString = '';

    if(valueChange.value < 0) {
      finalString += '-';
    } else {
      finalString += '+';
    }

    finalString += "$" + Math.abs(valueChange.value).toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}) + ' (' + valueChange.percent.toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}) + '%)';

    return finalString;
  }
}
