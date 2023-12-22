import { CommonModule } from '@angular/common';
import { AfterContentInit, AfterViewInit, Component, Input } from '@angular/core';
import { BluButton } from 'projects/blueprint/src/lib/button/button.component';
import { BluInput } from 'projects/blueprint/src/lib/input/input.component';
import { BehaviorSubject, Observable } from 'rxjs';
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
  imports: [CommonModule, BluInput, BluButton],
  templateUrl: './asset-more-details.component.html',
  styleUrl: './asset-more-details.component.scss'
})
export class AssetMoreDetailsComponent {
  @Input() asset$!: BehaviorSubject<Asset>;

  public assetAttributes: Attributes = [];

  ngOnInit() {
    this.asset$.subscribe((asset: Asset) => {
      switch(asset.assetType){
        case AssetType.Vehicle:
          this.assetAttributes = [
            {
              key: "Vehicle make",
              attribute: asset.make ?? ""
            },
            {
              key: "Model name",
              attribute: asset.model ?? ""
            },
            {
              key: "Model year",
              attribute: asset.year ?? 1900,
              type: "number"
            },
            {
              key: "Mileage",
              attribute: asset.mileage ?? 0,
              type: "number"
            },
            {
              key: "Nickname",
              attribute: asset.nickName ?? "",
              required: false,
            },
            {
              key: "Annual depreciation rate",
              attribute: asset.appreciationRate ?? 0,
              type: "number",
              required: false,
              tooltip: "The rate at which you expect this vehicle to decrease in value. Used for value projections."
            }
          ]
          break;
      }
    });
  }
}
