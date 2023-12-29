import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild } from '@angular/core';
import { AddVehicleFormComponent } from '../add-vehicle-form/add-vehicle-form.component';
import { Asset, AssetType, VehicleCustomAttributes } from '../../../constants/constants';
import { BehaviorSubject, combineLatest, filter, mergeMap, of, take, throwError } from 'rxjs';
import { BluButton } from 'projects/blueprint/src/lib/button/button.component';
import { BluSpinner } from 'projects/blueprint/src/lib/spinner/spinner.component';
import { BluHeading } from 'projects/blueprint/src/lib/heading/heading.component';
import { BluInput } from 'projects/blueprint/src/lib/input/input.component';
import { FeedbackType } from 'projects/blueprint/src/lib/common/constants';
import { DataService } from '../../../services/data.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ToastService } from '../../../services/toast.service';
import { NavigationService } from '../../../services/navigation-service.service';
import { TEXTS } from './add-asset-form.strings';
import { AddStockFormComponent } from '../add-stock-form/add-stock-form.component';

@Component({
  selector: 'app-add-asset-form',
  standalone: true,
  imports: [CommonModule, AddVehicleFormComponent, BluButton, BluSpinner, BluHeading, BluInput, MatTooltipModule, AddStockFormComponent],
  templateUrl: './add-asset-form.component.html',
  styleUrl: './add-asset-form.component.scss'
})
export class AddAssetFormComponent {
  @ViewChild('account') accountInput!: BluInput;
  @ViewChild('units') unitsInput!: BluInput;
  @ViewChild('vehicleForm') vehicleForm!: AddVehicleFormComponent;
  @ViewChild('customForm') customForm!: AddVehicleFormComponent;
  @ViewChild('stockForm') stockForm!: AddStockFormComponent;

  @Input() assetType!: AssetType;
  @Input() isAdd!: boolean;
  @Input() asset$ = of({} as Asset);
  @Input() isLoading$ = new BehaviorSubject<boolean>(false);

  public AssetType = AssetType;
  public FeedbackType = FeedbackType;
  public TEXTS = TEXTS;

  constructor(
    private dataService: DataService,
    private navigationService: NavigationService,
    private toastService: ToastService,
  ){}

  ngAfterContentInit() {
    this.asset$.subscribe((asset: Asset) => {
      if(asset.account && this.accountInput) {
        this.accountInput.value$.next(asset.account);
      }
      if(asset.units && this.unitsInput) {
        this.unitsInput.value$.next(asset.units.toString());
      }
    });
  }

  public onSubmit(): void {
    this.isLoading$.next(true);

    combineLatest([
      this.asset$,
      this.getSubForm()?.onSubmit$() ?? of({}),
      this.unitsInput?.validate$() ?? of(1),
      this.accountInput.validate$(),
    ]).pipe(
      take(1),
      filter(([
        asset,
        customAttributes,
        units,
        account,
      ]) => {
        return this.filterIncomplete(customAttributes, units, account);
      }),
      mergeMap(([
        asset,
        customAttributes,
        units,
        account,
      ]) => {
        const assetPayload: Asset = {
          units: parseInt(units),
          account: account,
          assetType: this.assetType,
          ...customAttributes,
        }

        if(asset.assetId) {
          return this.dataService.updateAsset$({assetId: asset.assetId, ...assetPayload}, this.isLoading$);
        } else {
          return this.dataService.putAsset$(assetPayload, this.isLoading$);
        }
      }),
    ).subscribe({
      next: ((asset: Asset) => {
        this.onSaveSuccess(asset);
      }),
      error: (() => {
        this.onSaveError();
      }),
    });
  }

  private getSubForm(): AddVehicleFormComponent | AddStockFormComponent | null {
    switch (this.assetType) {
      case AssetType.Vehicle:
        return this.vehicleForm;
      case AssetType.Custom:
        return this.customForm;
      case AssetType.Stock:
        return this.stockForm;
      default:
        return null;
    }
  }

  private filterIncomplete(
    customAttributes: Asset, 
    units: string, 
    account: string
  ) {
    const isValid = !!units && !!account && Object.keys(customAttributes).length !== 0;
    if(!isValid) {
      this.isLoading$.next(false);
    }
    return isValid;
  }

  private onSaveSuccess(asset: Asset): void {
    this.isLoading$.next(false);
    
    if(this.isAdd){
      this.navigationService.navigate('asset/' + asset.assetId);
      this.toastService.showToast("Successfully added " + asset.assetName, FeedbackType.SUCCESS);
    } else {
      this.toastService.showToast("Successfully updated " + asset.assetName, FeedbackType.SUCCESS);
    }
  }

  private onSaveError(): void {
    this.isLoading$.next(false);

    if(this.isAdd){
      this.toastService.showToast("There was an issue with adding this asset", FeedbackType.ERROR);
    } else {
      this.toastService.showToast("There was an issue with updating this asset", FeedbackType.ERROR);
    }
  }

  public onBack(): void {
    this.navigationService.back();
  }
}