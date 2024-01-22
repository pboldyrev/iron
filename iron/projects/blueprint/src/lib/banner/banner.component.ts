import { Component, Input } from '@angular/core';
import { FeedbackType } from '../common/constants';
import { CommonModule } from '@angular/common';
import { BluHeading } from '../heading/heading.component';
import { BluText } from '../text/text.component';
import { BluModal } from '../modal/modal.component';

@Component({
  selector: 'blu-banner',
  standalone: true,
  imports: [CommonModule, BluHeading, BluText, BluModal],
  templateUrl: './banner.component.html',
  styleUrl: './banner.component.css'
})
export class BluBanner {
  @Input() type = FeedbackType.INFO;
  @Input() title = "";
  @Input() subtitle = "";

  FeedbackType = FeedbackType;
}
