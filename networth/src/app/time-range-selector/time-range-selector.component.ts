import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BluSelectOption } from 'projects/blueprint/src/lib/common/constants';
import { BluSelect } from 'projects/blueprint/src/lib/select/select.component';

@Component({
  selector: 'app-time-range-selector',
  standalone: true,
  imports: [CommonModule, BluSelect],
  templateUrl: './time-range-selector.component.html',
  styleUrl: './time-range-selector.component.scss'
})
export class TimeRangeSelectorComponent {
  public timeOptions: BluSelectOption[] = [
    {
      id: 'day',
      text: '1 Day'
    },
    {
      id: 'week',
      text: '1 Week'
    },
    {
      id: 'month',
      text: '1 Month'
    },
    {
      id: 'year',
      text: '1 Year'
    },
    {
      id: 'ytd',
      text: 'Year to date'
    },
    {
      id: 'all',
      text: 'All time'
    },
  ]
}
