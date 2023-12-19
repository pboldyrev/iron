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
  @Input() size!: 'large' | 'medium' | 'small' | 'x-small';
  @Input() subheadingSize!: 'large' | 'medium' | 'small' | 'x-small';

  @Input() subheading: string = '';
  @Input() bold: boolean = false;
  @Input() feedback: 'success' | 'error' | null = null;
  @Input() subheadingPosition: 'top' | 'bottom' = 'bottom';
}
