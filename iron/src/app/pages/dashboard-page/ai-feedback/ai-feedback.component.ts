import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BluButton } from 'projects/blueprint/src/lib/button/button.component';
import { BluHeading } from 'projects/blueprint/src/lib/heading/heading.component';
import { BluLabel } from 'projects/blueprint/src/lib/label/label.component';
import { BluModal } from 'projects/blueprint/src/lib/modal/modal.component';
import { BluTag } from 'projects/blueprint/src/lib/tag/tag.component';
import { BluText } from 'projects/blueprint/src/lib/text/text.component';
import { Asset, AssetType } from 'src/app/shared/constants/constants';
import { ASSETS_TO_QUALIFY } from './ai-feedback.constants';
import { BluLink } from 'projects/blueprint/src/lib/link/link.component';

@Component({
  selector: 'app-ai-feedback',
  standalone: true,
  imports: [CommonModule, BluModal, BluLink, BluButton, BluText, BluLabel, BluHeading, BluTag, MatProgressSpinnerModule],
  templateUrl: './ai-feedback.component.html',
  styleUrl: './ai-feedback.component.scss'
})
export class AiFeedbackComponent {
  @Input() assets = [] as Asset[];

  ASSETS_TO_QUALIFY = ASSETS_TO_QUALIFY;

  onGetFeedback(): void {
    alert("This hasn't been implemented yet!");
  }

  getNumQualifyingAssets(): number {
    let numAssets = 0;

    this.assets.forEach((asset: Asset) => {
      if(asset.assetType !== AssetType.Cash) {
        numAssets++;
      }
    });

    return numAssets >= ASSETS_TO_QUALIFY ? ASSETS_TO_QUALIFY : numAssets;
  }

  shouldQualify(): boolean {
    let numAssets = this.getNumQualifyingAssets();
    return numAssets >= ASSETS_TO_QUALIFY;
  }
}
