import { Component, Inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeedbackType } from '../common/constants';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { BluValidationFeedback } from '../validation-popup/validation-feedback.component';

export type ToastData = {
  type: FeedbackType,
  message: string,
}

@Component({
  selector: 'blu-toast',
  standalone: true,
  imports: [CommonModule, BluValidationFeedback],
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css'],
})
export class BluToast {
  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: ToastData
  ) {}
}
