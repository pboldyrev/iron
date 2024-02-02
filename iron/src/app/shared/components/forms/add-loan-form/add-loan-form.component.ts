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

    this.asset$.subscribe((asset: Asset) => {
      if(asset.loanName && this.loanNameInput) {
        this.loanNameInput.value = asset.loanName;
        this.isContentSet = true;
      }
      if(asset.totalLoanAmount && this.totalLoanInput) {
        this.totalLoanInput.value = asset.totalLoanAmount.toString();
        this.isContentSet = true;
      }
      if(asset.paymentAmount && this.paymentAmountInput) {
        this.paymentAmountInput.value = asset.paymentAmount.toString();
        this.isContentSet = true;
      }
      if(asset.paymentFrequency && this.paymentFrequencyInput) {
        this.paymentFrequencyInput.selected = asset.paymentFrequency.toString();
        this.isContentSet = true;
      }
    });
  }

  public onSubmit(): Asset {
    const loanName = this.loanNameInput.validate();
    const totalLoan = this.totalLoanInput.validate();
    const paymentAmount = this.paymentAmountInput.validate();
    const paymentFrequency = this.paymentFrequencyInput.validate();

    if(!loanName || !totalLoan || !paymentAmount || !paymentFrequency) {
      return {};
    }

    let assetObj: Asset = {
      loanName: loanName,
      totalLoanAmount: parseFloat(totalLoan),
      paymentAmount: parseFloat(paymentAmount),
      paymentFrequency: paymentFrequency,
      initTotalValue: -parseFloat(totalLoan),
      initTimestamp: new Date(new Date().toLocaleDateString('en-US', {timeZone: 'UTC'})).valueOf(),
    };

    return assetObj;
  }
}
