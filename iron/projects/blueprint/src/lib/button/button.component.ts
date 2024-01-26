import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { BluIconName } from '../common/constants';
import { BluIcon } from '../icon/icon.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'blu-button',
  standalone: true,
  imports: [CommonModule, BluIcon, MatTooltipModule],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css'],
})
export class BluButton {
  @Input() type: 'primary' | 'secondary' | 'tertiary' | 'outline' | 'none' | 'error' | 'inverse' | 'info' = 'primary';
  @Input() iconName: BluIconName | null = null;
  @Input() iconOnly = false;
  @Input() iconSize = "18";
  @Input() fullWidth = false;
  @Input() iconType: 'info' | 'error' | 'success' | null = null;
  @Input() tooltip = '';
  @Input() disabled = false;
}
