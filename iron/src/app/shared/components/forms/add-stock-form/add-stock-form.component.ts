import { CommonModule } from '@angular/common';
import { AfterContentChecked, Component, Input, ViewChild } from '@angular/core';
import { FeedbackType } from 'projects/blueprint/src/lib/common/constants';
import { BluInput } from 'projects/blueprint/src/lib/input/input.component';
import { BehaviorSubject, Observable, combineLatest, map, of, take } from 'rxjs';
import { Asset } from 'src/app/shared/constants/constants';
import { TEXTS } from './add-stock-form.strings';
import { SYMBOLS } from 'src/assets/data/valid_symbols';

@Component({
  selector: 'app-add-stock-form',
  standalone: true,
  imports: [CommonModule, BluInput],
  templateUrl: './add-stock-form.component.html',
  styleUrl: './add-stock-form.component.scss'
})
export class AddStockFormComponent implements AfterContentChecked {
  @ViewChild('ticker') tickerInput!: BluInput;
  @ViewChild('purchaseDate') purchaseDateInput!: BluInput;
  @ViewChild('units') unitsInput!: BluInput;

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
      if(asset.ticker && this.tickerInput) {
        this.tickerInput.value = asset.ticker;
        this.isContentSet = true;
      }
      if(asset.initTimestamp && this.purchaseDateInput) {
        this.purchaseDateInput.value = asset.initTimestamp.toString();
        this.isContentSet = true;
      }
    });
  }

  public onSubmit(): Asset {
    const ticker = this.tickerInput.validate();
    const purchaseDate = this.purchaseDateInput.validate();
    const units = this.unitsInput.validate();

    const purchaseDateObj = new Date(parseInt(purchaseDate));
        
    if(purchaseDateObj.getFullYear() < 1900) {
      this.purchaseDateInput.isValid = false;
      this.purchaseDateInput.customFeedback = "We do not support assets from before Jan 1, 1900.";
      return {};
    }

    if(purchaseDateObj > new Date()) {
      this.purchaseDateInput.isValid = false;
      this.purchaseDateInput.customFeedback = "We do not support future purchases.";
      return {};
    }

    if(!SYMBOLS.includes(ticker)) {
      this.tickerInput.isValid = false;
      this.tickerInput.customFeedback = "We do not support this ticker."
      return {};
    }

    if(!ticker || !purchaseDate || !units) {
      return {};
    }
    
    return {
      ticker: ticker,
      initTimestamp: purchaseDateObj.valueOf(),
      initUnits: parseInt(units),
    };
  }
}
