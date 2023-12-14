import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeedbackType } from '../common/constants';
import { BluIcon } from '../icon/icon.component';
import { BluText } from '../text/text.component';

@Component({
  selector: 'blu-validation-feedback',
  standalone: true,
  imports: [CommonModule, BluIcon, BluText],
  templateUrl: './validation-feedback.component.html',
  styleUrls: ['./validation-feedback.component.css'],
})
export class BluValidationFeedback {
  @Input() type!: FeedbackType;
}
