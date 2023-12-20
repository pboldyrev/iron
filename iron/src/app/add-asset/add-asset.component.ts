import { CommonModule } from '@angular/common';
import { Component, Input, Output } from '@angular/core';
import { AddAssetOptionComponent } from './add-asset-option/add-asset-option.component';
import { AssetType } from '../shared/constants/constants';
import { BehaviorSubject, Observable, filter, take } from 'rxjs';
import { FIRST_STEP, LAST_STEP } from './add-asset.constants';
import { DataService } from '../shared/services/data.service';
import { v4 as uuid } from 'uuid';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-asset',
  standalone: true,
  imports: [CommonModule, AddAssetOptionComponent],
  templateUrl: './add-asset.component.html',
  styleUrl: './add-asset.component.scss'
})
export class AddAssetComponent {
  @Input() reset$!: Observable<boolean>;

  public AssetType = AssetType;

  constructor(
    private dataService: DataService,
    private router: Router,
  ) {}

  public onAssetTypeClicked(assetType: AssetType): void {
    switch (assetType) {
      case AssetType.Stock:
        this.router.navigate(['/add/stock']);
        break;
      case AssetType.Vehicle:
        this.router.navigate(['/add/vehicle']);
        break;
      case AssetType.CD:
        this.router.navigate(['/add/cd']);
        break;
      case AssetType.Savings:
        this.router.navigate(['/add/savings']);
        break;
      case AssetType.Custom:
        this.router.navigate(['/add/custom']);
        break;
    }
  }
}
