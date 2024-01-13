import { AfterContentInit, Component, Input } from '@angular/core';
import { FeedbackType } from '../common/constants';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { BluLabel } from '../label/label.component';
import { FEEDBACK_STRINGS } from 'src/app/shared/constants/strings';
import { BluValidationFeedback } from '../validation-popup/validation-feedback.component';
import { FormsModule } from '@angular/forms';
import { BluIcon } from '../icon/icon.component';

@Component({
  selector: 'blu-select',
  standalone: true,
  imports: [CommonModule, BluLabel, BluValidationFeedback, FormsModule, BluIcon],
  templateUrl: './select.component.html',
  styleUrl: './select.component.css'
})
export class BluSelect implements AfterContentInit {
  @Input() options!: string[];
  @Input() required = false;
  @Input() label: string | null = null;
  @Input() disabled = false;
  @Input() selected: string = '';
  @Input() size: 'small' | 'normal' = 'normal';

  public isValid = true;

  public FEEDBACK_STRINGS = FEEDBACK_STRINGS;
  public FeedbackType = FeedbackType;

  ngAfterContentInit() {
    if(!this.selected) {
      this.options.unshift(this.selected);
    }
  }

  public updateValue(value: string): void {
    this.selected = value;
    this.isValid = true;
  }

  public validate(): string {
    this.isValid = true;

    if(!this.selected || this.options.indexOf(this.selected) === -1) {
      this.isValid = false;
      return '';
    }

    return this.selected;
  }
}
