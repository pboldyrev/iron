import { Component, Input } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Asset } from '../../constants/constants';
import { CommonModule } from '@angular/common';
import { BluHeading } from 'projects/blueprint/src/lib/heading/heading.component';
import { BluSpinner } from 'projects/blueprint/src/lib/spinner/spinner.component';
import { BehaviorSubject, combineLatest, mergeMap, tap } from 'rxjs';
import { BluButton } from 'projects/blueprint/src/lib/button/button.component';
import { BluPill } from 'projects/blueprint/src/lib/pill/pill.component';
import { BluText } from 'projects/blueprint/src/lib/text/text.component';
import { BluIcon } from 'projects/blueprint/src/lib/icon/icon.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DisplayCurrencyPipe } from "../../../../../projects/blueprint/src/lib/common/pipes/display-currency.pipe";

export type TimeRangeOption = {
  selected: boolean,
  value: string
}

@Component({
    selector: 'app-networth',
    standalone: true,
    templateUrl: './networth.component.html',
    styleUrl: './networth.component.scss',
    imports: [CommonModule, BluHeading, BluSpinner, BluButton, BluPill, BluText, BluIcon, MatTooltipModule, DisplayCurrencyPipe]
})
export class NetworthComponent {
  @Input() totalNetworth!: number;
}