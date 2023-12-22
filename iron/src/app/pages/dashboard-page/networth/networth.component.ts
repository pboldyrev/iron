import { Component, Input } from '@angular/core';
import { DataService } from '../../../shared/services/data.service';
import { Asset } from '../../../shared/constants/constants';
import { CommonModule } from '@angular/common';
import { BluHeading } from 'projects/blueprint/src/lib/heading/heading.component';
import { BluSpinner } from 'projects/blueprint/src/lib/spinner/spinner.component';
import { BehaviorSubject, combineLatest, mergeMap, tap } from 'rxjs';
import { BluButton } from 'projects/blueprint/src/lib/button/button.component';
import { BluPill } from 'projects/blueprint/src/lib/pill/pill.component';
import { BluText } from 'projects/blueprint/src/lib/text/text.component';
import { BluIcon } from 'projects/blueprint/src/lib/icon/icon.component';
import { MatTooltipModule } from '@angular/material/tooltip';

export type TimeRangeOption = {
  selected: boolean,
  value: string
}

@Component({
  selector: 'app-networth',
  standalone: true,
  imports: [CommonModule, BluHeading, BluSpinner, BluButton, BluPill, BluText, BluIcon, MatTooltipModule],
  templateUrl: './networth.component.html',
  styleUrl: './networth.component.scss'
})
export class NetworthComponent {
  @Input() totalNetworth!: number | null;
  @Input() isLoading!: boolean;

  public getNetworthString(): string {
    let formattedValue = '$' + (this.totalNetworth?.toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}) ?? '0.00');
    
    if(formattedValue.charAt(1) === '-') {
      formattedValue = formattedValue.replace('-', '');
      formattedValue = '-' + formattedValue;
    }
    
    return formattedValue;
  }
}