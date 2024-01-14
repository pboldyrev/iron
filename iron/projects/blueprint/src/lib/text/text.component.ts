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
  @Input() size: 'xs' | 's' | 'm' | 'l' = 'm';
  @Input() type: 'primary' | 'secondary' | 'tertiary' | 'error' | 'success' | 'info' = "primary";
  @Input() weight: 'normal' | 'bold' = 'normal';
  @Input() capitalize = false;
  @Input() isNumber = false;
}
