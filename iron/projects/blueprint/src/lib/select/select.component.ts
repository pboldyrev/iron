import { Component, Input } from '@angular/core';
import { BluSelectOption, FeedbackType } from '../common/constants';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
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
export class BluSelect {
  @Input() options!: BluSelectOption[];

  @Input() size: 'small' | 'medium' | 'large' = 'small';
  @Input() type: 'primary' | 'secondary' = 'secondary';
  @Input() required: boolean = false;
  @Input() label: string | null = null;

  public id$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public text$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public isValid$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  public FEEDBACK_STRINGS = FEEDBACK_STRINGS;
  public FeedbackType = FeedbackType;

  ngOnInit() {
    let hasSelected = false;

    this.options.forEach((option: BluSelectOption) => {
      if(option.selected) {
        this.id$.next(option.id);
        this.text$.next(option.text);
        hasSelected = true;
      }
    });

    if(!hasSelected&& this.options.length > 0) {
      this.id$.next(this.options[0].id);
      this.text$.next(this.options[0].text);
    }
  }

  public updateValue(event: any): void {
    this.id$.next(event.target.value);
    this.text$.next(event.target.options[event.target.selectedIndex].text);
  }

  public validate(): void {
    this.text$.subscribe((value: string) => {
      if(!!value) {
        this.isValid$.next(true);
      } else {
        this.isValid$.next(false);
      }
    });
  }
}
