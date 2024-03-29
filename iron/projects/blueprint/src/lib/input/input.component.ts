import { Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, Observable, map, mergeMap, of, take, takeUntil } from 'rxjs';
import { BluValidationFeedback } from '../validation-popup/validation-feedback.component';
import { InputType } from 'src/app/shared/interfaces/interfaces';
import { RegexService } from 'src/app/shared/services/regex.service';
import { FeedbackType } from '../common/constants';
import { BluText } from '../text/text.component';
import { FEEDBACK_STRINGS } from 'src/app/shared/constants/strings';
import { BluLabel } from '../label/label.component';
import { DisplayIntegerPipe } from "../common/pipes/display-integer";
import { DisplayCurrencyPipe } from "../common/pipes/display-currency.pipe";
import { DisplayPercentPipe } from "../common/pipes/display-percent.pipe";
import { MatDatepickerModule, } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { DateService } from 'src/app/shared/services/date.service';

@Component({
    selector: 'blu-input',
    standalone: true,
    templateUrl: './input.component.html',
    styleUrls: ['./input.component.css'],
    providers: [MatDatepickerModule],
    imports: [CommonModule,  MatDatepickerModule, MatNativeDateModule, BluValidationFeedback, BluText, BluLabel, DisplayIntegerPipe, DisplayCurrencyPipe, DisplayPercentPipe],
    encapsulation: ViewEncapsulation.None,
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
  @Input() maxChars: number = 100;

  public value = "";
  public isValid = true;
  public FEEDBACK_STRINGS = FEEDBACK_STRINGS;
  public customFeedback = "";
  readonly maxDate = new Date(this.dateService.getLatestValidDate());

  constructor(
    private regexService: RegexService, 
    private dateService: DateService,
  ) {}

  ngOnInit() {
    if(this.initValue) {
      this.value = this.initValue;
      this.formatValue();
    }
  }

  public updateValue(event: any): void {
    this.value = event.target.value;
    this.isValid = true;
  }

  private removeFormatting(): void {
    if(this.type === "INTEGER") {
      this.value = this.value.replaceAll(/[^\d-]/g,'');
    }

    if(this.type === "CURRENCY" || this.type === "NUMBER" || this.type === "PERCENT") {
      this.value = this.value.replaceAll(/[^\d.-]/g,'');
    }
  }

  public validate(): string {
      this.removeFormatting();
      if(!this.required && (this.value === "" || !this.value)) {
        this.isValid = true;
        return this.value;
      }
      if(this.value && this.regexService.isValidString(this.value, this.type)) {
        this.isValid = true;
        return this.value;
      }
      this.isValid = false
      return "";
  }

  public formatValue(): void {
    let pipe: DisplayCurrencyPipe | DisplayIntegerPipe | DisplayPercentPipe;
    this.removeFormatting();
    switch (this.type) {
      case 'INTEGER':
        pipe = new DisplayIntegerPipe();
        this.value = pipe.transform(this.value);
        break;
      case 'CURRENCY':
        pipe = new DisplayCurrencyPipe();
        this.value = pipe.transform(parseFloat(this.value));
        break;
      case 'PERCENT':
        pipe = new DisplayPercentPipe();
        this.value = pipe.transform(parseFloat(this.value));
        break;
      default:
        break;
    }
  }

  public clearValueAndValidators(): void {
    this.value = "";
    this.isValid = true;
  }

  parseCurrency(str: string): number {
    if(str.charAt(0) === '$'){
      str = str.slice(1);
    }
    str = str.replaceAll(/[^\d.]/g,''); // remove non-digits, minus float point
    return parseFloat(str);
  }
}
