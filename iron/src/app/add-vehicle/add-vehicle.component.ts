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
import { BehaviorSubject, combineLatest, take } from 'rxjs';
import { BluSelect } from 'projects/blueprint/src/lib/select/select.component';
import { VEHICLE_MAKES } from './add-vehicle.constants';
import { ValueHistoryComponent } from '../value-history/value-history.component';
import { TEXTS } from './add-vehicle.strings';
import { ValueHistoryEntry } from '../value-history/value-history.constants';

@Component({
  selector: 'app-add-vehicle',
  standalone: true,
  imports: [CommonModule, BluModal, BluInput, BluText, MatTooltipModule, BluButton, BluSelect, ValueHistoryComponent],
  templateUrl: './add-vehicle.component.html',
  styleUrl: './add-vehicle.component.scss'
})
export class AddVehicleComponent {
  @ViewChild('vehicleMake') vehicleMakeInput!: BluSelect;
  @ViewChild('modelYear') modelYearInput!: BluSelect;
  @ViewChild('modelName') modelNameInput!: BluInput;
  @ViewChild('mileage') mileageInput!: BluInput;
  @ViewChild('nickname') nicknameInput!: BluInput;
  
  public TEXTS = TEXTS;
  public FeedbackType = FeedbackType;
  public userId: string = this.authService.getCurrentUserId();
  public showValueHistory$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public modelYears: BluSelectOption[] = this.getModelYears();
  public vehicleMakes: BluSelectOption[] = this.getVehicleMakes();

  private finalAssetName: string = "";

  constructor(
    private router: Router,
    private location: Location,
    private dataService: DataService,
    private authService: AuthService,
  ) {}

  public onClose(): void {
    this.location.back();
    this.showValueHistory$.next(false);
  }

  public onNext(): void {
    this.modelNameInput.validate();
    this.mileageInput.validate();

    combineLatest([
      this.vehicleMakeInput.value$,
      this.modelYearInput.value$,
      this.modelNameInput.value$,
      this.modelNameInput.isValid$,
      this.mileageInput.value$,
      this.mileageInput.isValid$,
      this.nicknameInput.value$,
    ]).pipe(take(1)).subscribe(([
      make,
      modelYear,
      modelName,
      isModelNameValid,
      mileage,
      isMileageValid,
      nickname
    ]:[
      string,
      string,
      string,
      boolean,
      string,
      boolean,
      string
    ]) => {
      let finalName: string;

      if(!isModelNameValid || !isMileageValid) {
        return;
      }

      finalName = modelYear + ' ' + make + ' ' + modelName;

      if(nickname !== "") {
        finalName += ' (' + nickname + ')';
      }

      this.finalAssetName = finalName;

      this.showValueHistory$.next(true);
    });
  }

  public onSaved(entries: ValueHistoryEntry[]) {
    const currentValue = entries[0]?.value ?? 0;
    const initValue = entries[entries.length -1]?.value ?? 0;

    this.dataService.addAsset$(this.userId, {
      assetName: this.finalAssetName,
      curValue: currentValue,
      initValue: initValue,
      numUnits: 1,
      lastUpdated: 0,
    }).subscribe();
    this.onClose();
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
    listOfMakes[0].selected = true;
    return listOfMakes;
  }
}
