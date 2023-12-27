import { CommonModule } from '@angular/common';
import { AfterContentInit, Component, Input, Output, ViewChild } from '@angular/core';
import { BluSelectOption, FeedbackType } from 'projects/blueprint/src/lib/common/constants';
import { BluInput } from 'projects/blueprint/src/lib/input/input.component';
import { BluSelect } from 'projects/blueprint/src/lib/select/select.component';
import { BluText } from 'projects/blueprint/src/lib/text/text.component';
import { VEHICLE_MAKES } from './add-vehicle-form.constants';
import { BehaviorSubject, Observable, Subject, combineLatest, filter, map, mergeMap, of, take } from 'rxjs';
import { Asset, AssetType, VehicleCustomAttributes } from 'src/app/shared/constants/constants';
import { DataService } from 'src/app/shared/services/data.service';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-add-vehicle-form',
  standalone: true,
  imports: [CommonModule, BluInput, BluText, BluSelect, MatTooltipModule],
  templateUrl: './add-vehicle-form.component.html',
  styleUrl: './add-vehicle-form.component.scss'
})
export class AddVehicleFormComponent implements AfterContentInit {
  @ViewChild('make') makeInput!: BluInput;
  @ViewChild('year') yearInput!: BluInput;
  @ViewChild('model') modelInput!: BluInput;
  @ViewChild('mileage') mileageInput!: BluInput;
  @ViewChild('depreciationRate') depreciationRateInput!: BluInput;
  @ViewChild('nickname') nicknameInput!: BluInput;

  @Input() asset$: Observable<Asset> = of({});
  @Input() isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  
  public FeedbackType = FeedbackType;

  constructor(
    private dataService: DataService,
  ){}

  ngAfterContentInit() {
    this.asset$.pipe(
      filter((asset: Asset) => !!asset.assetId)
    ).subscribe((asset: Asset) => {
      if(asset.nickName) {
        this.nicknameInput.value$.next(asset.nickName);
      }
      if(asset.make) {
        this.makeInput.value$.next(asset.make);
      }
      if(asset.model) {
        this.modelInput.value$.next(asset.model);
      }
      if(asset.year) {
        this.yearInput.value$.next(asset.year.toString());
      }
      if(asset.mileage) {
        this.mileageInput.value$.next(asset.mileage.toString());
      }
      if(asset.appreciationRate) {
        this.mileageInput.value$.next(asset.appreciationRate.toString());
      }
    });
  }

  public onSubmit$(): Observable<VehicleCustomAttributes> {
    return combineLatest([
      this.makeInput.validate$(),
      this.yearInput.validate$(),
      this.mileageInput.validate$(),
      this.modelInput.validate$(),
      this.depreciationRateInput.validate$(),
      this.nicknameInput.value$,
    ]).pipe(
      take(1),
      map(([
        make, 
        year, 
        mileage, 
        model,
        depreciationRate,
        nickname,
      ]: [
        string,
        string,
        string,
        string,
        string,
        string
      ]) => {
        if(!this.validateInputs(make, model, year, depreciationRate, mileage)) {
          return {};
        }

        const vehicleCustomAttributes: VehicleCustomAttributes = {
          make: make,
          model: model,
          year: parseInt(year),
          mileage: parseInt(mileage),
          nickName: nickname,
          appreciationRate: -parseFloat(depreciationRate),
        }

        return vehicleCustomAttributes;
      }),
    );
  }

  private validateInputs(
    make: string, 
    model: string, 
    year: string, 
    depreciationRate: string,
    mileage: string
  ): boolean {
    const yearAsInt = parseInt(year);
    let valid = true;

    if(yearAsInt < 1900) {
      this.isLoading$.next(false);
      this.yearInput.isValid$.next(false);
      this.yearInput.customFeedback$.next("We do not support vehicles older than 1900.");
      valid = false;
    }

    if(yearAsInt > (new Date()).getFullYear() + 1) {
      this.isLoading$.next(false);
      this.yearInput.isValid$.next(false);
      this.yearInput.customFeedback$.next("We do not support vehicles from the future.");
      valid = false;
    }

    if(Math.abs(parseFloat(depreciationRate)) > 1) {
      this.isLoading$.next(false);
      this.depreciationRateInput.isValid$.next(false);
      this.depreciationRateInput.customFeedback$.next("Depreciation rate must be between -1 and 1.");
      valid = false;
    }

    if(!make || !year || !mileage || !model) {
      this.isLoading$.next(false);
      valid = false;
    }

    return valid;
  }
}
