import { Component, Input } from '@angular/core';
import { AssetType, TypeToDisplayName, ValueChange } from '../../../shared/constants/constants';
import { CommonModule } from '@angular/common';
import { ValueChangeComponent } from '../../../shared/components/value-change/value-change.component';
import { BluHeading } from 'projects/blueprint/src/lib/heading/heading.component';
import { BehaviorSubject, mergeMap } from 'rxjs';
import { BluIcon } from 'projects/blueprint/src/lib/icon/icon.component';
import { BluButton } from 'projects/blueprint/src/lib/button/button.component';
import { DataService } from 'src/app/shared/services/data.service';
import { BluLink } from 'projects/blueprint/src/lib/link/link.component';
import { BluText } from 'projects/blueprint/src/lib/text/text.component';
import { Router } from '@angular/router';

export type AssetTypeSummary = {
  type: AssetType,
  total: number,
  valueChange?: ValueChange[],
};

@Component({
  selector: 'app-asset-type-card',
  standalone: true,
  imports: [CommonModule, ValueChangeComponent, BluHeading, BluIcon, BluButton, BluLink, BluText],
  templateUrl: './asset-type-card.component.html',
  styleUrl: './asset-type-card.component.scss'
})
export class AssetTypeCardComponent {
  @Input() asset!: AssetTypeSummary;
  
  public TypeToDisplayName = TypeToDisplayName;
  public isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    private router: Router,
  ) {}

  public onNavigateToSummary(): void {
    this.router.navigate(['/dashboard/' + this.asset.type]);
  }
}
