import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, take, takeUntil } from 'rxjs';
import { BluValidationFeedback } from '../validation-popup/validation-feedback.component';
import { InputType } from 'src/app/shared/interfaces/interfaces';
import { RegexService } from 'src/app/shared/services/regex.service';
import { FeedbackType } from '../common/constants';
import { BluText } from '../text/text.component';
import { FEEDBACK_STRINGS } from 'src/app/shared/constants/strings';
import { BluLabel } from '../label/label.component';

@Component({
  selector: 'blu-input',
  standalone: true,
  imports: [CommonModule, BluValidationFeedback, BluText, BluLabel],
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css'],
})
export class BluInput {
  @Input() type!: InputType;
  @Input() feedbackType!: FeedbackType;

  @Input() placeholder: string = '';
  @Input() label: string = '';
  @Input() fullWidth: boolean = false;
  @Input() disabled: boolean = false;
  @Input() currency: boolean = false;
  @Input() required: boolean = true;
  @Input() appearance: string = '';
  @Input() direction: string = 'ltr';
  @Input() initValue: string = '';
  @Input() tooltip: string = '';

  public value$ = new BehaviorSubject<string>('');
  public isValid$ = new BehaviorSubject<boolean>(true);
  public FEEDBACK_STRINGS = FEEDBACK_STRINGS;

  constructor(private regexService: RegexService) {}

  ngOnInit() {
    if(this.initValue) {
      this.value$.next(this.initValue);
    }
  }

  public updateValue(event: any): void {
    this.value$.next(event.target.value);
  }

  public validate(): void {
    this.value$.subscribe((value) => {
      if(!this.required && (value === "" || !value)) {
        this.isValid$.next(true);
        return;
      }
      this.isValid$.next(this.regexService.isValidString(value, this.type));
    });
  }

  public clearValueAndValidators(): void {
    this.value$.next("");
    this.isValid$.next(true);
  }
}
