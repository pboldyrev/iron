import { CommonModule } from '@angular/common';
import { Component, Input, Output } from '@angular/core';
import { AddAssetOptionComponent } from './add-asset-option/add-asset-option.component';
import { AssetType } from '../../../shared/constants/constants';
import { Observable } from 'rxjs';
import { NavigationService } from '../../../shared/services/navigation-service.service';

@Component({
  selector: 'app-add-asset-selection',
  standalone: true,
  imports: [CommonModule, AddAssetOptionComponent],
  templateUrl: './add-asset-selection.component.html',
  styleUrl: './add-asset-selection.component.scss'
})
export class AddAssetSelectionComponent {
  @Input() reset$!: Observable<boolean>;

  public AssetType = AssetType;

  constructor(
    private navigationService: NavigationService,
  ) {}

  public onAssetTypeClicked(assetType: AssetType): void {
    this.navigationService.navigate('/add/' + assetType);
  }
}
