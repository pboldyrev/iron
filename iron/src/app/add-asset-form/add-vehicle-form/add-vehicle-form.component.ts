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
import { Router } from '@angular/router';
import { NavigationService } from 'src/app/shared/services/navigation-service.service';

@Component({
  selector: 'app-add-vehicle-form',
  standalone: true,
  imports: [CommonModule, BluInput, BluText, BluSelect, MatTooltipModule, BluLink],
  templateUrl: './add-vehicle-form.component.html',
  styleUrl: './add-vehicle-form.component.scss'
})
export class AddVehicleFormComponent implements AfterViewInit {
  @ViewChild('mileage') mileageInput!: BluInput;
  @ViewChild('vin') vinInput!: BluInput;

  @Input() asset$!: Observable<Asset>;
  @Input() isLoading$ = new BehaviorSubject<boolean>(false);
  @Input() isAdd: boolean = false;

  public FeedbackType = FeedbackType;

  constructor(
    private navigationService: NavigationService,
  ){}

  ngAfterViewInit() {
    this.asset$.pipe(
      filter((asset: Asset) => !!asset.assetId ?? false)
    ).subscribe((asset: Asset) => {
      if(asset.vin && this.vinInput) {
        this.vinInput.value$.next(asset.vin);
      }
      if(asset.mileage && this.mileageInput) {
        this.mileageInput.value$.next(asset.mileage.toString());
      }
    });
  }

  public onSubmit$(): Observable<VehicleCustomAttributes> {
    return combineLatest([
      this.vinInput.validate$(),
      this.mileageInput.validate$()
    ]).pipe(
      take(1),
      map(([vin, mileage]: [string, string]) => {
        if (!vin) {
          return {};
        }

        const vehicleCustomAttributes: VehicleCustomAttributes = {
          vin: vin,
          mileage: parseInt(mileage),
        };

        return vehicleCustomAttributes;
      }),
    )
  }

  public onSwitchToCustom(): void {
    this.navigationService.navigate('/add/custom');
  }
}
