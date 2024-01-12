import { CommonModule } from '@angular/common';
import { AfterContentInit, AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { BluButton } from 'projects/blueprint/src/lib/button/button.component';
import { FeedbackType } from 'projects/blueprint/src/lib/common/constants';
import { BluHeading } from 'projects/blueprint/src/lib/heading/heading.component';
import { BluInput } from 'projects/blueprint/src/lib/input/input.component';
import { BluSpinner } from 'projects/blueprint/src/lib/spinner/spinner.component';
import { BehaviorSubject, Observable, take } from 'rxjs';
import { AddAssetFormComponent } from 'src/app/shared/components/forms/add-asset-form/add-asset-form.component';
import { AddVehicleFormComponent } from 'src/app/shared/components/forms/add-vehicle-form/add-vehicle-form.component';
import { Asset, AssetType } from 'src/app/shared/constants/constants';
import { ToastService } from 'src/app/shared/services/toast.service';

export type Attributes = {
  key: string,
  attribute: string | number,
  type?: "string" | "number" | "date",
  required?: boolean,
  tooltip?: string,
}[];

@Component({
  selector: 'app-asset-more-details',
  standalone: true,
  imports: [CommonModule, BluInput, BluButton, AddAssetFormComponent, BluSpinner, BluHeading],
  templateUrl: './asset-more-details.component.html',
  styleUrl: './asset-more-details.component.scss'
})
export class AssetMoreDetailsComponent {
  @ViewChild("addAssetForm") addAssetForm!: AddAssetFormComponent;
  
  @Input() asset$!: Observable<Asset>;

  public isLoading$ = new BehaviorSubject<boolean>(false);

  public AssetType = AssetType;

  constructor(
    private toastService: ToastService,
  ){}

  public onSaveInit(): void {
    this.addAssetForm.onSubmit();
  }
}
