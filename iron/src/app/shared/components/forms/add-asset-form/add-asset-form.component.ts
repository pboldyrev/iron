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
import { AddCustomFormComponent } from '../add-custom-form/add-custom-form.component';
import { BluSelect } from 'projects/blueprint/src/lib/select/select.component';
import { BluText } from 'projects/blueprint/src/lib/text/text.component';
import { BluLink } from 'projects/blueprint/src/lib/link/link.component';
import { BluPopup } from 'projects/blueprint/src/lib/popup/popup.component';
import { BluModal } from 'projects/blueprint/src/lib/modal/modal.component';

@Component({
  selector: 'app-add-asset-form',
  standalone: true,
  imports: [CommonModule, AddVehicleFormComponent, BluButton, BluSpinner, BluHeading, BluInput, MatTooltipModule, AddStockFormComponent, AddCustomFormComponent, BluSelect, BluText, BluLink, BluPopup, BluModal],
  templateUrl: './add-asset-form.component.html',
  styleUrl: './add-asset-form.component.scss'
})
export class AddAssetFormComponent {
  @ViewChild('addAccountPopup') addAccountPopup!: BluPopup;
  @ViewChild('account') accountInput!: BluSelect;
  @ViewChild('vehicleForm') vehicleForm!: AddVehicleFormComponent;
  @ViewChild('customForm') customForm!: AddCustomFormComponent;
  @ViewChild('stockForm') stockForm!: AddStockFormComponent;

  @Input() assetType!: AssetType;
  @Input() isAdd!: boolean;
  @Input() asset$ = of({} as Asset);
  @Input() isLoading$ = new BehaviorSubject<boolean>(false);

  public AssetType = AssetType;
  public FeedbackType = FeedbackType;
  public TEXTS = TEXTS;
  public accountOptions: string[] = ['Taxable', 'Non-Taxable', 'Other'];

  private isContentSet = false;

  constructor(
    private dataService: DataService,
    private navigationService: NavigationService,
    private toastService: ToastService,
  ){}

  ngAfterContentInit() {
    if(this.isAdd === false || this.isContentSet) {
      return;
    }

    this.asset$.subscribe((asset: Asset) => {
      if(asset.account && this.accountInput) {
        this.accountInput.updateValue(asset.account);
        this.isContentSet = true;
      }
    });
  }

  public onSubmit(): void {
    this.isLoading$.next(true);

    combineLatest([
      this.asset$,
      this.getSubForm()?.onSubmit$() ?? of({}),
      this.accountInput.validate$(),
    ]).pipe(
      take(1),
      filter(([
        asset,
        customAttributes,
        account,
      ]) => {
        return this.filterIncomplete(customAttributes, account);
      }),
      mergeMap(([
        asset,
        customAttributes,
        account,
      ]) => {
        const assetPayload: Asset = {
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

  private getSubForm(): AddVehicleFormComponent | AddStockFormComponent | AddCustomFormComponent | null {
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
    account: string
  ) {
    const isValid =  !!account && Object.keys(customAttributes).length !== 0;
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

  public onManageAccount(): void {
    this.navigationService.navigate('/settings');
  }

  public onBack(): void {
    this.navigationService.back();
  }
}
