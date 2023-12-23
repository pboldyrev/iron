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
import { VEHICLE_MAKES } from '../add-vehicle-form/add-vehicle-form.constants';
import { ValueHistoryComponent } from '../../pages/asset-details-page/value-history/value-history.component';
import { TEXTS } from '../add-vehicle-form/add-vehicle.strings';
import { BluSpinner } from 'projects/blueprint/src/lib/spinner/spinner.component';
import { Asset, AssetType, VehicleCustomAttributes } from '../../shared/constants/constants';
import { BluValidationFeedback } from 'projects/blueprint/src/lib/validation-popup/validation-feedback.component';
import { ToastService } from 'src/app/shared/services/toast.service';
import { AddVehicleFormComponent } from '../add-vehicle-form/add-vehicle-form.component';

@Component({
  selector: 'app-add-vehicle',
  standalone: true,
  imports: [CommonModule, BluModal, BluInput, BluText, MatTooltipModule, BluButton, BluSelect, ValueHistoryComponent, BluSpinner, BluValidationFeedback, AddVehicleFormComponent],
  templateUrl: './add-vehicle.component.html',
  styleUrl: './add-vehicle.component.scss'
})

export class AddVehicleComponent {  
  @ViewChild("addVehicleForm") addVehicleForm!: AddVehicleFormComponent;

  public FeedbackType = FeedbackType;
  public isLoading: boolean = false;

  constructor(
    private location: Location,
    private router: Router,
    private toastService: ToastService,
  ) {}

  public onInitSave(): void {
    this.isLoading = true;
    this.addVehicleForm.onSubmit();
  }

  public onSaved(asset: Asset): void {
    this.isLoading = false;

    if(!asset.assetId) {
      return;
    }

    this.router.navigate(['asset/' + asset.assetId]);
    this.toastService.showToast("Successfully added a " + asset.assetName, FeedbackType.SUCCESS);
  }

  public onClose(): void {
    this.location.back();
  }
}