import { CommonModule, Location } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { BluInput } from 'projects/blueprint/src/lib/input/input.component';
import { BluModal } from 'projects/blueprint/src/lib/modal/modal.component';
import { BluText } from 'projects/blueprint/src/lib/text/text.component';
import { BluSelectOption, FeedbackType } from 'projects/blueprint/src/lib/common/constants';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BluButton } from 'projects/blueprint/src/lib/button/button.component';
import { Router } from '@angular/router';
import { DataService } from '../../shared/services/data.service';
import { AuthService } from '../../shared/services/auth.service';
import { BehaviorSubject, Subject, combineLatest, filter, map, mergeMap, of, switchMap, take, tap } from 'rxjs';
import { BluSelect } from 'projects/blueprint/src/lib/select/select.component';
import { VEHICLE_MAKES } from './add-vehicle.constants';
import { ValueHistoryComponent } from '../../pages/asset-details-page/value-history/value-history.component';
import { TEXTS } from './add-vehicle.strings';
import { BluSpinner } from 'projects/blueprint/src/lib/spinner/spinner.component';
import { Asset, AssetType, VehicleCustomAttributes } from '../../shared/constants/constants';
import { BluValidationFeedback } from 'projects/blueprint/src/lib/validation-popup/validation-feedback.component';
import { ToastService } from 'src/app/shared/services/toast.service';

export type VehicleAssetData = {
  assetName: string
} | null

@Component({
  selector: 'app-add-vehicle',
  standalone: true,
  imports: [CommonModule, BluModal, BluInput, BluText, MatTooltipModule, BluButton, BluSelect, ValueHistoryComponent, BluSpinner, BluValidationFeedback],
  templateUrl: './add-vehicle.component.html',
  styleUrl: './add-vehicle.component.scss'
})

export class AddVehicleComponent {
  @ViewChild('vehicleMake') vehicleMakeInput!: BluSelect;
  @ViewChild('modelYear') modelYearInput!: BluSelect;
  @ViewChild('modelName') modelNameInput!: BluInput;
  @ViewChild('mileage') mileageInput!: BluSelect;
  @ViewChild('nickname') nicknameInput!: BluInput;
  
  public TEXTS = TEXTS;
  public FeedbackType = FeedbackType;
  public modelYears: BluSelectOption[] = this.getModelYears();
  public vehicleMakes: BluSelectOption[] = this.getVehicleMakes();
  public vehicleMileage: BluSelectOption[] = this.getVehicleMileages();
  public isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public errorMessage$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor(
    private router: Router,
    private location: Location,
    private dataService: DataService,
    private toastService: ToastService,
  ) {}

  ngOnInit() {
    
  }

  public onClose(): void {
    this.location.back();
  }

  public onNext(): void {
    this.isLoading$.next(true);

    this.vehicleMakeInput.validate();
    this.modelYearInput.validate();
    this.mileageInput.validate();
    this.modelNameInput.validate();

    combineLatest([
      this.vehicleMakeInput.isValid$,
      this.modelYearInput.isValid$,
      this.mileageInput.isValid$,
      this.modelNameInput.isValid$,
      this.vehicleMakeInput.text$,
      this.modelYearInput.id$,
      this.mileageInput.id$,
      this.modelNameInput.value$,
      this.nicknameInput.value$,
    ]).pipe(
      take(1),
      filter(([
        vehicleMakeInputValid, 
        modelYearInputValid, 
        mileageInputValid, 
        modelNameInputValid, 
        vehicleMakeInputValue, 
        modelYearInputValue, 
        mileageInputValue, 
        modelNameInputValue, 
        nicknameInputValue, 
      ]: [
        boolean,
        boolean,
        boolean,
        boolean,
        string,
        string,
        string,
        string,
        string
      ]) => {
        if(!vehicleMakeInputValid || 
          !modelYearInputValid || 
          !mileageInputValid || 
          !modelNameInputValid) {
            this.isLoading$.next(false);
            return false;
          }
        return true;
      }),
      mergeMap(([
        vehicleMakeInputValid, 
        modelYearInputValid, 
        mileageInputValid, 
        modelNameInputValid, 
        vehicleMakeInputValue, 
        modelYearInputValue, 
        mileageInputValue, 
        modelNameInputValue, 
        nicknameInputValue, 
      ]: [
        boolean,
        boolean,
        boolean,
        boolean,
        string,
        string,
        string,
        string,
        string
      ]) => {
        let finalName = this.getFinalName(modelNameInputValue, modelYearInputValue ?? '', vehicleMakeInputValue ?? "", nicknameInputValue);

        const vehicleCustomAttributes: VehicleCustomAttributes = {
          make: vehicleMakeInputValue,
          model: modelNameInputValue,
          year: parseInt(modelYearInputValue),
          mileage: parseInt(mileageInputValue),
        }

        return this.dataService.putAsset$({
          assetName: finalName,
          units: 1,
          assetType: AssetType.Vehicle,
          ...vehicleCustomAttributes,
        }, this.isLoading$);
      }),
    ).subscribe({
      next: (asset: Asset) => {
        this.router.navigate(['asset/' + asset.assetId]);
        this.toastService.showToast("Successfully added a " + asset.assetName, FeedbackType.SUCCESS);
      },
      error: (error) => {
        console.log(error);
        this.isLoading$.next(false);
        this.errorMessage$.next(TEXTS.UNKNOWN_ERROR);
      }
    });
  }

  private getFinalName(
    modelName: string, 
    modelYear: string,
    make: string,
    nickname: string
  ): string {
    let finalName = modelYear + ' ' + make + ' ' + modelName;

    if(nickname !== "") {
      finalName += ' (' + nickname + ')';
    }

    return finalName;
  }

  private getModelYears(): BluSelectOption[] {
    let listOfYears: BluSelectOption[] = [];
    const curYear = (new Date).getFullYear();
    for(let i = 1900; i <= curYear; ++i){
      const year = i.toString();
      listOfYears.push(
      {
        id: year,
        text: year
      });
    }
    listOfYears[listOfYears.length-1].selected = true;
    return listOfYears;
  }

  private getVehicleMakes(): BluSelectOption[] {
    let listOfMakes: BluSelectOption[] = [];
    VEHICLE_MAKES.forEach((make: string) => {
      listOfMakes.push({
        id: make,
        text: make,
      })
    });
    return listOfMakes;
  }

  private getVehicleMileages(): BluSelectOption[] {
    let listOfMileages: BluSelectOption[] = [];
    listOfMileages.push({
      id: "0",
      text: "< 10,000 miles",
    });
    for(let i = 10000; i < 240000; i+=10000){
      const mileage = i.toLocaleString();
      listOfMileages.push({
        id: mileage,
        text: mileage + " miles",
      })
    }
    listOfMileages.push({
      id: "250000",
      text: "> 250,000 miles"
    });
    return listOfMileages;
  }
}
