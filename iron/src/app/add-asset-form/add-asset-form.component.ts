import { CommonModule } from '@angular/common';
import { Component, Input, Output, ViewChild } from '@angular/core';
import { AddVehicleFormComponent } from './add-vehicle-form/add-vehicle-form.component';
import { Asset, AssetType, VehicleCustomAttributes } from '../shared/constants/constants';
import { BehaviorSubject, Observable, Subject, combineLatest, filter, map, mergeMap, of, take, throwError } from 'rxjs';
import { BluButton } from 'projects/blueprint/src/lib/button/button.component';
import { BluSpinner } from 'projects/blueprint/src/lib/spinner/spinner.component';
import { BluHeading } from 'projects/blueprint/src/lib/heading/heading.component';
import { BluInput } from 'projects/blueprint/src/lib/input/input.component';
import { FeedbackType } from 'projects/blueprint/src/lib/common/constants';
import { DataService } from '../shared/services/data.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { ToastService } from '../shared/services/toast.service';

@Component({
  selector: 'app-add-asset-form',
  standalone: true,
  imports: [CommonModule, AddVehicleFormComponent, BluButton, BluSpinner, BluHeading, BluInput, MatTooltipModule],
  templateUrl: './add-asset-form.component.html',
  styleUrl: './add-asset-form.component.scss'
})
export class AddAssetFormComponent {
  @ViewChild('account') accountInput!: BluInput;
  @ViewChild('units') unitsInput!: BluInput;
  @ViewChild('addVehicleForm') addVehicleForm!: AddVehicleFormComponent;

  @Input() assetType!: AssetType;
  @Input() isAdd!: boolean;
  @Input() asset$: Observable<Asset> = of({});
  @Input() isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  @Output() savedAsset$: Subject<Asset> = new Subject<Asset>();

  public AssetType = AssetType;
  public FeedbackType = FeedbackType;

  constructor(
    private dataService: DataService,
    private router: Router,
    private toastService: ToastService,
  ){}

  ngAfterContentInit() {
    this.asset$.pipe(
      filter((asset: Asset) => !!asset.assetId)
    ).subscribe((asset: Asset) => {
      if(asset.account) {
        this.accountInput.value$.next(asset.account);
      }
      if(asset.units) {
        this.unitsInput.value$.next(asset.units.toString());
      }
    });
  }

  public onSubmit(): void {
    this.isLoading$.next(true);

    combineLatest([
      this.asset$,
      this.addVehicleForm.onSubmit$(),
      this.unitsInput.validate$(),
      this.accountInput.validate$(),
    ]).pipe(
      take(1),
      mergeMap(([
        asset,
        vehicleCustomAttributes,
        units,
        account,
      ]) => {
        if(Object.keys(vehicleCustomAttributes).length === 0 || !units || !account) {
          this.isLoading$.next(false);
          return throwError(() => new Error());
        }

        const vehiclePayload: Asset = {
          ...vehicleCustomAttributes,
          assetName: this.getFinalName(vehicleCustomAttributes),
          units: parseInt(units),
          account: account,
          assetType: this.assetType,
        }

        if(asset.assetId) {
          return this.dataService.updateAsset$({assetId: asset.assetId, ...vehiclePayload}, this.isLoading$);
        }
        
        return this.dataService.putAsset$(vehiclePayload, this.isLoading$);
      }),
    ).subscribe({
      next: ((asset: Asset) => {
        this.savedAsset$.next(asset);
        if(this.isAdd){
          this.toastService.showToast("Successfully added " + asset.assetName, FeedbackType.SUCCESS);
        } else {
          this.toastService.showToast("Successfully updated " + asset.assetName, FeedbackType.SUCCESS);
        }
      }),
      error: (() => {
        this.isLoading$.next(false);
        if(this.isAdd){
          this.toastService.showToast("There was an issue with adding this asset", FeedbackType.ERROR);
        } else {
          this.toastService.showToast("There was an issue with updating this asset", FeedbackType.ERROR);
        }
      }),
    });
  }

  public onSaved(asset: Asset): void {
    this.savedAsset$.next(asset);
  }

  public onDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  private getFinalName(
    customAttributes: VehicleCustomAttributes
  ): string {
    let finalName = customAttributes.year + ' ' + customAttributes.make + ' ' + customAttributes.model;

    if(customAttributes.nickName !== "") {
      finalName += ' (' + customAttributes.nickName + ')';
    }

    return finalName;
  }

}
