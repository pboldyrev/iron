import { AfterContentInit, Component, Input } from '@angular/core';
import { FeedbackType } from '../common/constants';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { BluLabel } from '../label/label.component';
import { FEEDBACK_STRINGS } from 'src/app/shared/constants/strings';
import { BluValidationFeedback } from '../validation-popup/validation-feedback.component';

@Component({
  selector: 'blu-select',
  standalone: true,
  imports: [CommonModule, BluLabel, BluValidationFeedback,],
  templateUrl: './select.component.html',
  styleUrl: './select.component.css'
})
export class BluSelect implements AfterContentInit {
  @Input() options!: string[];
  @Input() required: boolean = false;
  @Input() label: string | null = null;

  public selected: string = '';
  public isValid = true;

  public FEEDBACK_STRINGS = FEEDBACK_STRINGS;
  public FeedbackType = FeedbackType;

  ngAfterContentInit() {
    this.options.unshift(this.selected);
  }

  public updateValue(value: string): void {
    this.selected = value;
  }

  public validate$(): Observable<string> {
    this.isValid = true;

    if(!this.selected) {
      this.isValid = false;
    }

    return of(this.selected);
  }
}
