import { Component, Input } from '@angular/core';
import { FeedbackType } from '../common/constants';

@Component({
  selector: 'blu-banner',
  standalone: true,
  imports: [],
  templateUrl: './banner.component.html',
  styleUrl: './banner.component.css'
})
export class BluBanner {
  @Input() type!: FeedbackType;
  @Input() title = "";
  @Input() content = "";
}
