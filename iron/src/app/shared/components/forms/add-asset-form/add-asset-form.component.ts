import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild } from '@angular/core';
import { AddVehicleFormComponent } from '../add-vehicle-form/add-vehicle-form.component';
import { Asset, AssetType, AssetValue, VehicleAttributes } from '../../../constants/constants';
import { BehaviorSubject, Observable, combineLatest, filter, map, merge, mergeMap, of, take, tap, throwError } from 'rxjs';
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
import { AddCashFormComponent } from '../add-cash-form/add-cash-form.component';
import { BluSelect } from 'projects/blueprint/src/lib/select/select.component';
import { BluText } from 'projects/blueprint/src/lib/text/text.component';
import { BluLink } from 'projects/blueprint/src/lib/link/link.component';
import { BluPopup } from 'projects/blueprint/src/lib/popup/popup.component';
import { BluModal } from 'projects/blueprint/src/lib/modal/modal.component';
import { HttpErrorResponse } from '@angular/common/http';
import { AddLoanFormComponent } from '../add-loan-form/add-loan-form.component';

@Component({
  selector: 'app-add-asset-form',
  standalone: true,
  imports: [CommonModule, AddLoanFormComponent, AddVehicleFormComponent, BluButton, BluSpinner, BluHeading, BluInput, MatTooltipModule, AddStockFormComponent, AddCashFormComponent, BluSelect, BluText, BluLink, BluPopup, BluModal],
  templateUrl: './add-asset-form.component.html',
  styleUrl: './add-asset-form.component.scss'
})
export class AddAssetFormComponent {
  @ViewChild('addAccountPopup') addAccountPopup!: BluPopup;
  @ViewChild('account') accountInput!: BluSelect;
  @ViewChild('vehicleForm') vehicleForm!: AddVehicleFormComponent;
  @ViewChild('customForm') customForm!: AddCashFormComponent;
  @ViewChild('stockForm') stockForm!: AddStockFormComponent;

  @Input() assetType!: AssetType;
  @Input() isAdd!: boolean;
  @Input() asset$ = of({} as Asset);
  @Input() isLoading$ = new BehaviorSubject<boolean>(false);

  submitDisabled = false;

  public AssetType = AssetType;
  public FeedbackType = FeedbackType;
  public TEXTS = TEXTS;
  public accountOptions: string[] = ['Taxable', 'Non-Taxable', 'Retirement', '401k', 'Roth 401k', 'IRA', 'Roth IRA', 'HSA', 'Other'];

  private isContentSet = false;

  constructor(
    private dataService: DataService,
    private navigationService: NavigationService,
    private toastService: ToastService,
  ){}

  ngOnInit() {
    this.isLoading$.subscribe((isLoading: boolean) => {
      this.submitDisabled = isLoading;
    });
  }

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

    const customAttributes = this.getSubForm()?.onSubmit() ?? {};
    const account = this.accountInput.validate();

    this.asset$.pipe(
      take(1),
      filter((asset: Asset) => {
        return this.filterIncomplete(customAttributes, account);
      }),
      mergeMap((asset) => {
        const assetPayload: Asset = {
          account: account,
          assetType: this.assetType,
          ...customAttributes,
        }

        if(asset.assetId) {
          return this.dataService.updateAsset$({assetId: asset.assetId, ...assetPayload}, this.isLoading$);
        }

        if (this.assetType === AssetType.Vehicle) {
          const initValue: AssetValue = {
            timestamp: customAttributes.initTimestamp ?? 0,
            totalValue: customAttributes.initTotalValue ?? 0,
            units: 1,
          };
          return this.dataService.putAsset$(assetPayload, initValue, this.isLoading$);
        }

        if (this.assetType === AssetType.Stock) {
          const initValue: AssetValue = {
            timestamp: customAttributes.initTimestamp ?? 0,
            totalValue: 0,
            units: customAttributes.initUnits ?? 1,
          };
          return this.dataService.putAsset$(assetPayload, initValue, this.isLoading$);
        }

        if (this.assetType === AssetType.Cash) {
          const initValue: AssetValue = {
            timestamp: customAttributes.initTimestamp ?? 0,
            totalValue: customAttributes.initTotalValue ?? 0,
            units: 1,
          };
          return this.dataService.putAsset$(assetPayload, initValue, this.isLoading$);
        }

        return this.dataService.putAsset$(assetPayload, null, this.isLoading$);
      
      }),
    ).subscribe({
      next: ((asset: Asset) => {
        this.onSaveSuccess(asset);
      }),
      error: ((err: HttpErrorResponse) => {
        this.onSaveError(err);
      }),
    });
  }

  private getSubForm(): AddVehicleFormComponent | AddStockFormComponent | AddCashFormComponent | null {
    switch (this.assetType) {
      case AssetType.Vehicle:
        return this.vehicleForm;
      case AssetType.Cash:
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

  private onSaveError(err: HttpErrorResponse): void {
    this.isLoading$.next(false);

    if(this.isAdd){
      if(this.assetType === AssetType.Vehicle && err.status === 400) {
        this.toastService.showToast("We do not support this VIN", FeedbackType.ERROR);
      }
    }
  }

  public onManageAccount(): void {
    this.navigationService.navigate('/settings');
  }

  public onBack(): void {
    this.navigationService.back();
  }
}
