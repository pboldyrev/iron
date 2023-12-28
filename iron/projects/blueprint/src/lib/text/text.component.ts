import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'blu-text',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.css'],
})
export class BluText {
  @Input() size: 'large' | 'medium' | 'small' | 'x-small' = 'medium';
  @Input() type: 'primary' | 'secondary' | 'tertiary' | 'error' | 'success' | 'info' = "primary";
  @Input() weight: 'normal' | 'bold' = 'normal';
  @Input() capitalize = false;
  @Input() isNumber = false;
}
