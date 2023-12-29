import { CommonModule, Location } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { BluInput } from 'projects/blueprint/src/lib/input/input.component';
import { BluModal } from 'projects/blueprint/src/lib/modal/modal.component';
import { BluText } from 'projects/blueprint/src/lib/text/text.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BluButton } from 'projects/blueprint/src/lib/button/button.component';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../shared/services/data.service';
import { AuthService } from '../../shared/services/auth.service';
import { BehaviorSubject, Observable, Subject, combineLatest, filter, map, mergeMap, of, switchMap, take, tap } from 'rxjs';
import { BluSelect } from 'projects/blueprint/src/lib/select/select.component';
import { ValueHistoryComponent } from '../asset-details-page/value-history/value-history.component';
import { TEXTS } from '../../shared/components/forms/add-vehicle-form/add-vehicle-form.strings';
import { BluSpinner } from 'projects/blueprint/src/lib/spinner/spinner.component';
import { Asset, AssetType, VehicleCustomAttributes } from '../../shared/constants/constants';
import { BluValidationFeedback } from 'projects/blueprint/src/lib/validation-popup/validation-feedback.component';
import { ToastService } from 'src/app/shared/services/toast.service';
import { AddAssetFormComponent } from 'src/app/shared/components/forms/add-asset-form/add-asset-form.component';
import { NavigationService } from 'src/app/shared/services/navigation-service.service';
import { AssetToTitleMap } from './add-asset-page.constants';

@Component({
  selector: 'app-add-asset-page',
  standalone: true,
  imports: [CommonModule, BluModal, BluInput, BluText, MatTooltipModule, BluButton, BluSelect, ValueHistoryComponent, BluSpinner, BluValidationFeedback, AddAssetFormComponent],
  templateUrl: './add-asset-page.component.html',
  styleUrl: './add-asset-page.component.scss'
})

export class AddAssetPageComponent {
  public AssetType = AssetType;
  public assetType$ = new BehaviorSubject<AssetType>(AssetType.Custom);

  constructor(
    private navigationService: NavigationService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    const assetType = this.navigationService.getUrlParam(this.route, 'assetType');
    if(assetType === '') {
      this.assetType$.next(AssetType.Custom);
    } else {
      this.assetType$.next(assetType as AssetType);
    }
  }

  public getTitle$(): Observable<string> {
    return this.assetType$.pipe(
      map((assetType: AssetType) => {
        return AssetToTitleMap[assetType];
      })
    );
  }
}