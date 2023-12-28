import { CommonModule } from '@angular/common';
import { AfterContentInit, AfterViewChecked, AfterViewInit, Component, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { BluSelectOption, FeedbackType } from 'projects/blueprint/src/lib/common/constants';
import { BluInput } from 'projects/blueprint/src/lib/input/input.component';
import { BluSelect } from 'projects/blueprint/src/lib/select/select.component';
import { BluText } from 'projects/blueprint/src/lib/text/text.component';
import { VEHICLE_MAKES } from './add-vehicle-form.constants';
import { BehaviorSubject, Observable, Subject, combineLatest, filter, map, mergeMap, of, switchMap, take } from 'rxjs';
import { Asset, AssetType, VehicleCustomAttributes } from 'src/app/shared/constants/constants';
import { DataService } from 'src/app/shared/services/data.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BluLink } from 'projects/blueprint/src/lib/link/link.component';

@Component({
  selector: 'app-add-vehicle-form',
  standalone: true,
  imports: [CommonModule, BluInput, BluText, BluSelect, MatTooltipModule, BluLink],
  templateUrl: './add-vehicle-form.component.html',
  styleUrl: './add-vehicle-form.component.scss'
})
export class AddVehicleFormComponent implements AfterViewInit {
  @ViewChild('make') makeInput!: BluInput;
  @ViewChild('year') yearInput!: BluInput;
  @ViewChild('model') modelInput!: BluInput;
  @ViewChild('mileage') mileageInput!: BluInput;
  @ViewChild('vin') vinInput!: BluInput;
  @ViewChild('mileageVin') mileageVinInput!: BluInput;
  @ViewChild('depreciationRate') depreciationRateInput!: BluInput;
  @ViewChild('nickname') nicknameInput!: BluInput;
  @ViewChild('trackManually') trackManually!: TemplateRef<Element>;

  @Input() asset$!: Observable<Asset>;
  @Input() isLoading$ = new BehaviorSubject<boolean>(false);
  @Input() isAdd: boolean = false;
  
  public showVinTracking = true;

  public FeedbackType = FeedbackType;

  constructor(
    private dataService: DataService,
  ){}

  ngAfterViewInit() {
    this.asset$.pipe(
      filter((asset: Asset) => !!asset.assetId ?? false)
    ).subscribe((asset: Asset) => {
      if(asset.nickName && this.nicknameInput) {
        this.nicknameInput.value$.next(asset.nickName);
      }
      if(asset.vin && this.vinInput) {
        this.vinInput.value$.next(asset.vin);
      }
      if(asset.make && this.makeInput) {
        this.makeInput.value$.next(asset.make);
      }
      if(asset.model && this.modelInput) {
        this.modelInput.value$.next(asset.model);
      }
      if(asset.year && this.yearInput) {
        this.yearInput.value$.next(asset.year.toString());
      }
      if(asset.mileage && this.mileageInput) {
        this.mileageInput.value$.next(asset.mileage.toString());
      }
      if(asset.appreciationRate && this.depreciationRateInput) {
        this.depreciationRateInput.value$.next(asset.appreciationRate.toString());
      }
    });
  }

  public onToggleTrackingType(): void {
    this.showVinTracking = !this.showVinTracking;
  }

  public onSubmit$(): Observable<VehicleCustomAttributes> {
    if(this.showVinTracking) {
      return this.vinTrackingFormSubmission$();
    } else {
      return this.manualTrackingFormSubmission$();
    }
  }

  private vinTrackingFormSubmission$(): Observable<Asset> {
    return combineLatest([
      this.vinInput.validate$(),
      this.mileageVinInput.validate$()
    ]).pipe(
      take(1),
      map(([vin, mileage]: [string, string]) => {
        if (!vin) {
          return {};
        }

        const vehicleCustomAttributes: Asset = {
          vin: vin,
          mileage: parseInt(mileage),
        };

        return vehicleCustomAttributes;
      }),
    )
  }

  private manualTrackingFormSubmission$(): Observable<Asset> {
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

        const vehicleCustomAttributes: Asset = {
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
