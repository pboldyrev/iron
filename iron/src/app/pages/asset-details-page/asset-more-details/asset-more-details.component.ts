import { CommonModule } from '@angular/common';
import { AfterContentInit, AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { BluButton } from 'projects/blueprint/src/lib/button/button.component';
import { BluInput } from 'projects/blueprint/src/lib/input/input.component';
import { BluSpinner } from 'projects/blueprint/src/lib/spinner/spinner.component';
import { BehaviorSubject, Observable } from 'rxjs';
import { AddVehicleFormComponent } from 'src/app/add-asset/add-vehicle-form/add-vehicle-form.component';
import { Asset, AssetType } from 'src/app/shared/constants/constants';

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
  imports: [CommonModule, BluInput, BluButton, AddVehicleFormComponent, BluSpinner],
  templateUrl: './asset-more-details.component.html',
  styleUrl: './asset-more-details.component.scss'
})
export class AssetMoreDetailsComponent {
  @ViewChild("addVehicleForm") addVehicleForm!: AddVehicleFormComponent;
  @Input() asset$!: BehaviorSubject<Asset>;

  public isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public onSaveInit(): void {
    this.addVehicleForm.onSubmit();
  }
}
