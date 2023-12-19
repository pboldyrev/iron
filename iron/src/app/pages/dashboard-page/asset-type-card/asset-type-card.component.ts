import { Component, Input } from '@angular/core';
import { AssetType, TypeToDisplayName, ValueChange } from '../../../shared/constants/constants';
import { CommonModule } from '@angular/common';
import { ValueChangeComponent } from '../value-change/value-change.component';
import { BluHeading } from 'projects/blueprint/src/lib/heading/heading.component';
import { BehaviorSubject } from 'rxjs';
import { BluIcon } from 'projects/blueprint/src/lib/icon/icon.component';
import { BluButton } from 'projects/blueprint/src/lib/button/button.component';

@Component({
  selector: 'app-asset-summary',
  standalone: true,
  imports: [CommonModule, ValueChangeComponent, BluHeading, BluIcon, BluButton],
  templateUrl: './asset-type-card.component.html',
  styleUrl: './asset-type-card.component.scss'
})
export class AssetTypeCardComponent {
  @Input() asset!: {
    type: AssetType,
    valueChange: ValueChange[],
  };
  public TypeToDisplayName = TypeToDisplayName;

  public totalValueString$: BehaviorSubject<string> = new BehaviorSubject<string>("$10,000.34");
}
