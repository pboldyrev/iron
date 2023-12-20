import { Component, Input } from '@angular/core';
import { AssetType, TypeToDisplayName, ValueChange } from '../../../shared/constants/constants';
import { CommonModule } from '@angular/common';
import { ValueChangeComponent } from '../value-change/value-change.component';
import { BluHeading } from 'projects/blueprint/src/lib/heading/heading.component';
import { BehaviorSubject, mergeMap } from 'rxjs';
import { BluIcon } from 'projects/blueprint/src/lib/icon/icon.component';
import { BluButton } from 'projects/blueprint/src/lib/button/button.component';
import { DataService } from 'src/app/shared/services/data.service';

export type AssetTypeSummary = {
  type: AssetType,
  valueChange?: ValueChange[],
};

@Component({
  selector: 'app-asset-summary',
  standalone: true,
  imports: [CommonModule, ValueChangeComponent, BluHeading, BluIcon, BluButton],
  templateUrl: './asset-type-card.component.html',
  styleUrl: './asset-type-card.component.scss'
})
export class AssetTypeCardComponent {
  @Input() asset!: AssetTypeSummary;
  
  public TypeToDisplayName = TypeToDisplayName;
  public assetTotal: string | null = null;
  public isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    private dataService: DataService,
  ) {}

  ngOnInit() {
    this.dataService.getCurrentNetWorth$(null, this.isLoading$).subscribe();

    this.dataService.dataChanged$.pipe(
      mergeMap(() => {
        return this.dataService.getCurrentNetWorth$(this.asset.type, this.isLoading$)
      })
    ).subscribe({
      next: (assetTotalWorth: number) => {
        this.assetTotal = '$' + assetTotalWorth.toLocaleString();
      },
      error: (error) => {
        console.log(error);
        this.isLoading$.next(false);
        this.assetTotal = "ERR";
      }
    });
  }
}
