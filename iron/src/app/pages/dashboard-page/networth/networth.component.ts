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

export type TimeRangeOption = {
  selected: boolean,
  value: string
}

@Component({
  selector: 'app-networth',
  standalone: true,
  imports: [CommonModule, BluHeading, BluSpinner, BluButton, BluPill, BluText],
  templateUrl: './networth.component.html',
  styleUrl: './networth.component.scss'
})
export class NetworthComponent {
  @Input() totalNetworth!: number | null;
  @Input() isLoading$!: BehaviorSubject<boolean>;
}