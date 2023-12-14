import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeedbackType } from '../common/constants';
import { BluIcon } from '../icon/icon.component';

@Component({
  selector: 'blu-toast',
  standalone: true,
  imports: [CommonModule, BluIcon],
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css'],
})
export class BluToast {
  @Input() type!: FeedbackType;
}
