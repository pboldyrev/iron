import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { BluIconName } from '../common/constants';
import { BluIcon } from '../icon/icon.component';

@Component({
  selector: 'blu-button',
  standalone: true,
  imports: [CommonModule, BluIcon],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css'],
})
export class BluButton {
  @Input() type!: string;
  @Input() iconName!: BluIconName;

  @Input() iconOnly: boolean = false;
  @Input() fullWidth: boolean = false;
  @Input() size: 'small' | 'normal' = 'normal';
}
