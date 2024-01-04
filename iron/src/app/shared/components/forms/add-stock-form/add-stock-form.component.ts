import { CommonModule } from '@angular/common';
import { AfterContentChecked, Component, Input, ViewChild } from '@angular/core';
import { FeedbackType } from 'projects/blueprint/src/lib/common/constants';
import { BluInput } from 'projects/blueprint/src/lib/input/input.component';
import { BehaviorSubject, Observable, combineLatest, map, of, take } from 'rxjs';
import { Asset } from 'src/app/shared/constants/constants';
import { TEXTS } from './add-stock-form.strings';
import { NavigationService } from 'src/app/shared/services/navigation-service.service';

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
    if(this.isAdd || this.isContentSet) {
      return;
    }

    this.asset$.subscribe((asset: Asset) => {
      if(asset.ticker && this.tickerInput) {
        this.tickerInput.value$.next(asset.ticker);
      }
      this.isContentSet = true;
    });
  }

  public onSubmit$(): Observable<Asset> {
    return combineLatest([
      this.tickerInput.validate$(),
      this.purchaseDateInput.validate$(),
      this.unitsInput.validate$(),
    ]).pipe(
      take(1),
      map(([ticker, purchaseDate, units]: [string, string, string]) => {
        const purchaseDateObj = new Date(purchaseDate);
        
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

        if(!ticker || !purchaseDate || !units) {
          return {};
        }
        
        return {
          ticker: ticker,
          purchaseDate: new Date(purchaseDate),
          units: parseInt(units)
        };
      }),
    )
  }
}
