import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { BluIcon } from '../icon/icon.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'blu-text',
  standalone: true,
  imports: [CommonModule, BluIcon, MatTooltipModule],
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.css'],
})
export class BluText {
  @Input() size: 'xs' | 's' | 'm' | 'l' = 'm';
  @Input() type: 'primary' | 'secondary' | 'tertiary' | 'error' | 'success' | 'info' = "primary";
  @Input() weight: 'normal' | 'bold' = 'normal';
  @Input() capitalize = false;
  @Input() isNumber = false;
  @Input() tooltip = "";
}
