import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { BluValidationFeedback } from '../validation-popup/validation-feedback.component';
import { InputType } from 'src/app/shared/interfaces/interfaces';
import { RegexService } from 'src/app/shared/services/regex.service';
import { FeedbackType } from '../common/constants';
import { BluText } from '../text/text.component';
import { FEEDBACK_STRINGS } from 'src/app/shared/constants/strings';

@Component({
  selector: 'blu-input',
  standalone: true,
  imports: [CommonModule, BluValidationFeedback, BluText],
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css'],
})
export class BluInput {
  @Input() type!: InputType;
  @Input() feedbackType!: FeedbackType;

  @Input() placeholder: string = '';
  @Input() fullWidth: boolean = false;
  @Input() disabled: boolean = false;

  public value$ = new BehaviorSubject<string>('');
  public isValid$ = new BehaviorSubject<boolean>(true);
  public FEEDBACK_STRINGS = FEEDBACK_STRINGS;

  constructor(private regexService: RegexService) {}

  public updateValue(event: any): void {
    this.value$.next(event.target.value);
  }

  public validate(): void {
    this.value$.subscribe((value) => {
      this.isValid$.next(this.regexService.isValidString(value, this.type));
    });
  }
}
