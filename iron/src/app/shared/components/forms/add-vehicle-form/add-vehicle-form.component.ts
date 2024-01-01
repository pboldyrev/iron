import { CommonModule } from '@angular/common';
import { AfterContentChecked, AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { FeedbackType } from 'projects/blueprint/src/lib/common/constants';
import { BluInput } from 'projects/blueprint/src/lib/input/input.component';
import { BluSelect } from 'projects/blueprint/src/lib/select/select.component';
import { BluText } from 'projects/blueprint/src/lib/text/text.component';
import { BehaviorSubject, Observable, combineLatest, filter, map, take } from 'rxjs';
import { Asset, VehicleCustomAttributes } from 'src/app/shared/constants/constants';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BluLink } from 'projects/blueprint/src/lib/link/link.component';
import { NavigationService } from 'src/app/shared/services/navigation-service.service';
import { TEXTS, TOOLTIPS } from './add-vehicle-form.strings';

@Component({
  selector: 'app-add-vehicle-form',
  standalone: true,
  imports: [CommonModule, BluInput, BluText, BluSelect, MatTooltipModule, BluLink],
  templateUrl: './add-vehicle-form.component.html',
  styleUrl: './add-vehicle-form.component.scss'
})
export class AddVehicleFormComponent implements AfterContentChecked {
  @ViewChild('mileage') mileageInput!: BluInput;
  @ViewChild('vin') vinInput!: BluInput;

  @Input() asset$!: Observable<Asset>;
  @Input() isLoading$ = new BehaviorSubject<boolean>(false);
  @Input() isAdd = false;

  public FeedbackType = FeedbackType;
  public TEXTS = TEXTS;
  public TOOLTIPS = TOOLTIPS;

  constructor(
    private navigationService: NavigationService,
  ){}

  ngAfterContentChecked() {
    if(this.isAdd) {
      return;
    }

    this.asset$.subscribe((asset: Asset) => {
      if(asset.vin && this.vinInput) {
        this.vinInput.value$.next(asset.vin);
      }
      if(asset.mileage && this.mileageInput) {
        this.mileageInput.value$.next(asset.mileage.toString());
      }
    });
  }

  public onSubmit$(): Observable<Asset> {
    return combineLatest([
      this.vinInput.validate$(),
      this.mileageInput.validate$()
    ]).pipe(
      take(1),
      map(([vin, mileage]: [string, string]) => {
        if(!vin) {
          return {};
        }
        
        return {
          vin: vin,
          mileage: parseInt(mileage),
        };
      }),
    )
  }

  public onSwitchToCustom(): void {
    this.navigationService.navigate('/add/custom');
  }
}
