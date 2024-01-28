import { CommonModule } from '@angular/common';
import { AfterContentChecked, Component, Input, ViewChild } from '@angular/core';
import { FeedbackType } from 'projects/blueprint/src/lib/common/constants';
import { BluInput } from 'projects/blueprint/src/lib/input/input.component';
import { Observable, BehaviorSubject, take, map, combineLatest, of } from 'rxjs';
import { Asset } from 'src/app/shared/constants/constants';
import { TEXTS } from './add-cash-form.strings';

@Component({
  selector: 'app-add-cash-form',
  standalone: true,
  imports: [CommonModule, BluInput],
  templateUrl: './add-cash-form.component.html',
  styleUrl: './add-cash-form.component.scss'
})
export class AddCashFormComponent implements AfterContentChecked {
  @ViewChild('assetName') assetNameInput!: BluInput;
  @ViewChild('appreciationRate') appreciationRateInput!: BluInput;
  @ViewChild('curValue') curValueInput!: BluInput;

  @Input() asset$!: Observable<Asset>;
  @Input() isLoading$ = new BehaviorSubject<boolean>(false);
  @Input() isAdd = false;

  public FeedbackType = FeedbackType;
  public TEXTS = TEXTS;

  private isContentSet = false;

  ngAfterContentChecked() {
    if(this.isAdd === false || this.isContentSet) {
      return;
    }

    this.asset$.subscribe((asset: Asset) => {
      if(asset.assetName && this.assetNameInput) {
        this.assetNameInput.value = asset.assetName;
        this.isContentSet = true;
      }
      if(asset.appreciationRate && this.appreciationRateInput) {
        this.appreciationRateInput.value = asset.appreciationRate.toString();
        this.isContentSet = true;
      }
    });
  }

  public onSubmit(): Asset {
    const assetName = this.assetNameInput.validate();
    const appreciationRate = this.appreciationRateInput.validate();
    const curValue = this.isAdd ? this.curValueInput.validate() : ''

    if(parseFloat(appreciationRate) < 0) {
      this.appreciationRateInput.isValid = false;
      this.appreciationRateInput.customFeedback = "Appreciation rate may not be negative.";
      return {};
    }

    if(!assetName || !appreciationRate || !curValue) {
      return {};
    }

    let assetObj: Asset = {
      assetName: assetName,
      appreciationRate: parseFloat(appreciationRate),
    };

    if(this.isAdd) {
      assetObj.initTotalValue = parseFloat(curValue);
      assetObj.initTimestamp = new Date(new Date().toLocaleDateString('en-US', {timeZone: 'UTC'})).valueOf();
    }
    
    return assetObj;
  }
}
