import { CommonModule, Location } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { BluInput } from 'projects/blueprint/src/lib/input/input.component';
import { BluModal } from 'projects/blueprint/src/lib/modal/modal.component';
import { BluText } from 'projects/blueprint/src/lib/text/text.component';
import { BluSelectOption, FeedbackType } from 'projects/blueprint/src/lib/common/constants';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BluButton } from 'projects/blueprint/src/lib/button/button.component';
import { Router } from '@angular/router';
import { DataService } from '../shared/services/data.service';
import { AuthService } from '../shared/services/auth.service';
import { BehaviorSubject, Subject, combineLatest, filter, map, mergeMap, of, switchMap, take, tap } from 'rxjs';
import { BluSelect } from 'projects/blueprint/src/lib/select/select.component';
import { VEHICLE_MAKES } from './add-vehicle.constants';
import { ValueHistoryComponent } from '../value-history/value-history.component';
import { TEXTS } from './add-vehicle.strings';
import { BluSpinner } from 'projects/blueprint/src/lib/spinner/spinner.component';

export type VehicleAssetData = {
  assetName: string
} | null

@Component({
  selector: 'app-add-vehicle',
  standalone: true,
  imports: [CommonModule, BluModal, BluInput, BluText, MatTooltipModule, BluButton, BluSelect, ValueHistoryComponent, BluSpinner],
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
  public userId: string = this.authService.getCurrentUserId();
  public modelYears: BluSelectOption[] = this.getModelYears();
  public vehicleMakes: BluSelectOption[] = this.getVehicleMakes();
  public vehicleMileage: BluSelectOption[] = this.getVehicleMileages();
  public isLoading: boolean = false;

  constructor(
    private router: Router,
    private location: Location,
    private dataService: DataService,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    
  }

  public onClose(): void {
    this.location.back();
  }

  public onNext(): void {
    this.isLoading = true;

    this.vehicleMakeInput.validate();
    this.modelYearInput.validate();
    this.mileageInput.validate();
    this.modelNameInput.validate();

    combineLatest([
      this.vehicleMakeInput.isValid$,
      this.modelYearInput.isValid$,
      this.mileageInput.isValid$,
      this.modelNameInput.isValid$,
      this.vehicleMakeInput.value$,
      this.modelYearInput.value$,
      this.mileageInput.value$,
      this.modelNameInput.value$,
      this.nicknameInput.value$,
    ]).pipe(
      take(1),
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
      ]) => {
        if(
          !vehicleMakeInputValid || 
          !modelYearInputValid || 
          !mileageInputValid || 
          !modelNameInputValid
        ) {
          this.isLoading = false;
          return "";
        }

        let finalName = this.getFinalName(modelNameInputValue, modelYearInputValue ?? "", vehicleMakeInputValue ?? "", nicknameInputValue);

        return this.dataService.addAsset$(this.userId, {
          assetName: finalName,
          numUnits: 1,
          lastUpdated: 0,
        });
      }),
      filter(assetId => assetId !== "")
    ).subscribe((assetId: string | undefined) => {
      this.router.navigate(['asset/' + assetId + '/value-history']);
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
