import { CommonModule } from '@angular/common';
import { AfterContentChecked, Component, Input, ViewChild } from '@angular/core';
import { BluButton } from 'projects/blueprint/src/lib/button/button.component';
import { BluInput } from 'projects/blueprint/src/lib/input/input.component';
import { TEXTS } from './add-loan-form.strings';
import { FeedbackType } from 'projects/blueprint/src/lib/common/constants';
import { BehaviorSubject, Observable } from 'rxjs';
import { Asset } from 'src/app/shared/constants/constants';
import { FREQUENCY_OPTIONS } from './add-loan-form.constants';
import { BluSelect } from 'projects/blueprint/src/lib/select/select.component';

@Component({
  selector: 'add-loan-form',
  standalone: true,
  imports: [CommonModule, BluInput, BluButton, BluSelect],
  templateUrl: './add-loan-form.component.html',
  styleUrl: './add-loan-form.component.scss'
})
export class AddLoanFormComponent implements AfterContentChecked {
  @ViewChild('loanName') loanNameInput!: BluInput;
  @ViewChild('paymentAmount') paymentAmountInput!: BluInput;
  @ViewChild('paymentFrequency') paymentFrequencyInput!: BluSelect;
  @ViewChild('totalLoan') totalLoanInput!: BluInput;

  @Input() asset$!: Observable<Asset>;
  @Input() isLoading$ = new BehaviorSubject<boolean>(false);
  @Input() isAdd = false;

  TEXTS = TEXTS;
  FREQUENCY_OPTIONS = FREQUENCY_OPTIONS;
  FeedbackType = FeedbackType;
  private isContentSet = false;

  ngAfterContentChecked() {
    if(this.isAdd === false || this.isContentSet) {
      return;
    }

    // this.asset$.subscribe((asset: Asset) => {
    //   if(asset.ticker && this.tickerInput) {
    //     this.tickerInput.value = asset.ticker;
    //     this.isContentSet = true;
    //   }
    //   if(asset.initTimestamp && this.purchaseDateInput) {
    //     this.purchaseDateInput.value = asset.initTimestamp.toString();
    //     this.isContentSet = true;
    //   }
    // });
  }
}
