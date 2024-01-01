import { CommonModule } from '@angular/common';
import { AfterContentChecked, Component, Input, ViewChild } from '@angular/core';
import { FeedbackType } from 'projects/blueprint/src/lib/common/constants';
import { BluInput } from 'projects/blueprint/src/lib/input/input.component';
import { Observable, BehaviorSubject, take, map, combineLatest } from 'rxjs';
import { Asset } from 'src/app/shared/constants/constants';
import { TEXTS } from './add-custom-form.strings';

@Component({
  selector: 'app-add-custom-form',
  standalone: true,
  imports: [CommonModule, BluInput],
  templateUrl: './add-custom-form.component.html',
  styleUrl: './add-custom-form.component.scss'
})
export class AddCustomFormComponent implements AfterContentChecked {
  @ViewChild('assetName') assetNameInput!: BluInput;
  @ViewChild('appreciationRate') appreciationRateInput!: BluInput;
  @ViewChild('curValue') curValueInput!: BluInput;

  @Input() asset$!: Observable<Asset>;
  @Input() isLoading$ = new BehaviorSubject<boolean>(false);
  @Input() isAdd = false;

  public FeedbackType = FeedbackType;
  public TEXTS = TEXTS;

  ngAfterContentChecked() {
    if(this.isAdd) {
      return;
    }

    this.asset$.subscribe((asset: Asset) => {
      if(asset.assetName && this.assetNameInput) {
        this.assetNameInput.value$.next(asset.assetName);
      }
    });
  }

  public onSubmit$(): Observable<Asset> {
    return combineLatest([
      this.assetNameInput.validate$(),
      this.appreciationRateInput.validate$(),
      this.curValueInput.validate$(),
    ]).pipe(
      take(1),
      map(([assetName, appreciationRate, curValue]: [string, string, string]) => {
        if(!assetName || !appreciationRate) {
          return {};
        }
        
        return {
          assetName: assetName,
          appreciationRate: parseFloat(appreciationRate),
          curValue: parseFloat(curValue) ?? 0,
          initValue: parseFloat(curValue) ?? 0,
        };
      }),
    )
  }
}
