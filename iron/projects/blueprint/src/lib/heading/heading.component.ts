import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { BluText } from '../text/text.component';

@Component({
  selector: 'blu-heading',
  standalone: true,
  imports: [CommonModule, BluText],
  templateUrl: './heading.component.html',
  styleUrls: ['./heading.component.css'],
})
export class BluHeading {
  @Input() size: 'xs' | 's' | 'm' | 'l' = 'm';
  @Input() subheadingSize: 'xs' | 's' | 'm' | 'l' = 'm';
  @Input() subheading = '';
  @Input() bold = false;
  @Input() feedback: 'success' | 'error' | null = null;
  @Input() subheadingPosition: 'top' | 'bottom' = 'bottom';
  @Input() type: 'primary' | 'secondary' | 'tertiary' = 'primary';
  @Input() isNumber = false;
}
