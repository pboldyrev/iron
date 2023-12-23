import { CommonModule } from '@angular/common';
import { Component, Input, Output, ViewChild } from '@angular/core';
import { BluSelectOption, FeedbackType } from 'projects/blueprint/src/lib/common/constants';
import { BluInput } from 'projects/blueprint/src/lib/input/input.component';
import { BluSelect } from 'projects/blueprint/src/lib/select/select.component';
import { BluText } from 'projects/blueprint/src/lib/text/text.component';
import { VEHICLE_MAKES } from './add-vehicle-form.constants';
import { BehaviorSubject, Observable, Subject, combineLatest, filter, mergeMap, of, take } from 'rxjs';
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
export class AddVehicleFormComponent {
  @ViewChild('make') vehicleMakeInput!: BluInput;
  @ViewChild('year') modelYearInput!: BluInput;
  @ViewChild('model') modelNameInput!: BluInput;
  @ViewChild('mileage') mileageInput!: BluInput;
  @ViewChild('nickname') nicknameInput!: BluInput;

  @Input() isLoading$!: BehaviorSubject<boolean>;
  @Input() asset$: Observable<Asset> = of({});
  @Output() savedAsset$: Subject<Asset> = new Subject<Asset>();
  
  public FeedbackType = FeedbackType;

  constructor(
    private dataService: DataService,
  ){}

  ngOnInit() {
    this.asset$?.subscribe((asset: Asset) => {
      if(asset.nickName) {
        this.nicknameInput.value$.next(asset.nickName);
      }
      if(asset.make) {
        this.vehicleMakeInput.value$.next(asset.make);
      }
      if(asset.model) {
        this.modelNameInput.value$.next(asset.model);
      }
      if(asset.year) {
        this.modelYearInput.value$.next(asset.year.toString());
      }
      if(asset.mileage) {
        this.mileageInput.value$.next(asset.mileage.toString());
      }
    });
  }

  public onSubmit(): void {
    this.isLoading$.next(true);

    combineLatest([
      this.asset$,
      this.vehicleMakeInput.validate$(),
      this.modelYearInput.validate$(),
      this.mileageInput.validate$(),
      this.modelNameInput.validate$(),
      this.nicknameInput.value$,
    ]).pipe(
      take(1),
      filter(([
        asset,
        vehicleMakeInputValue, 
        modelYearInputValue, 
        mileageInputValue, 
        modelNameInputValue, 
        nicknameInputValue, 
      ]: [
        Asset,
        string,
        string,
        string,
        string,
        string
      ]) => {
        if(!vehicleMakeInputValue || 
          !modelYearInputValue || 
          !mileageInputValue || 
          !modelNameInputValue) {
            this.isLoading$.next(false);
            return false;
          }
        return true;
      }),
      mergeMap(([
        asset,
        vehicleMakeInputValue, 
        modelYearInputValue, 
        mileageInputValue, 
        modelNameInputValue, 
        nicknameInputValue, 
      ]: [
        Asset,
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
          mileage: parseInt(mileageInputValue.replace(',', '')),
          nickName: nicknameInputValue,
        }

        if(asset.assetId) {
          return this.dataService.updateAsset$({
            assetId: asset.assetId === "" ? "" : asset.assetId,
            assetName: finalName,
            units: 1,
            assetType: AssetType.Vehicle,
            ...vehicleCustomAttributes,
          }, this.isLoading$);
        } else {
          return this.dataService.putAsset$({
            assetId: asset.assetId === "" ? "" : asset.assetId,
            assetName: finalName,
            units: 1,
            assetType: AssetType.Vehicle,
            ...vehicleCustomAttributes,
          }, this.isLoading$);
        }
      }),
    ).subscribe({
      next: (asset: Asset) => {
        this.savedAsset$.next(asset);
      },
      error: () => {
        this.isLoading$.next(false);
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

  public getVehicleMakes(): BluSelectOption[] {
    let listOfMakes: BluSelectOption[] = [];
    VEHICLE_MAKES.forEach((make: string) => {
      listOfMakes.push({
        id: make,
        text: make,
      })
    });
    return listOfMakes;
  }

  public getVehicleMileages(): BluSelectOption[] {
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

  public getModelYears(): BluSelectOption[] {
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
}
