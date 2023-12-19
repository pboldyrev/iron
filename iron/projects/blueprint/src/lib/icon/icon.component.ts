import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  octCheck,
  octXCircle,
  octX,
  octInfo,
  octHome,
  octGear,
  octGraph,
  octSignIn,
  octSignOut,
  octThreeBars,
  octPlus,
  octChevronDown,
  octChevronUp,
  octKebabHorizontal,
  octLock,
  octGlobe,
  octRocket,
  octQuestion,
} from '@ng-icons/octicons';
import {
  heroBuildingLibrary, 
  heroChevronDown, 
  heroChevronUp, 
  heroRocketLaunch,
  heroBanknotes,
  heroClock,
  heroArrowPath,
  heroTrash,
  heroArrowLeft,
  heroQuestionMarkCircle,
} from '@ng-icons/heroicons/outline';
import { BluIconName, BluToIconMap } from '../common/constants';
import { NgIconComponent, provideIcons } from '@ng-icons/core';

@Component({
  selector: 'blu-icon',
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.css'],
  viewProviders: [
    provideIcons({
      octCheck,
      octXCircle,
      octX,
      octInfo,
      octHome,
      octGear,
      octGraph,
      octSignIn,
      octSignOut,
      octThreeBars,
      octPlus,
      octChevronUp,
      octChevronDown,
      octKebabHorizontal,
      octLock,
      octGlobe,
      octRocket,
      octQuestion,
      heroBuildingLibrary,
      heroRocketLaunch,
      heroChevronUp,
      heroChevronDown,
      heroBanknotes,
      heroClock,
      heroArrowPath,
      heroTrash,
      heroArrowLeft,
    }),
  ],
})
export class BluIcon {
  @Input() name!: BluIconName;

  @Input() size: string = '16';
  @Input() type: 'success' | 'error' | null = null;

  public bluToIconMap = BluToIconMap;
}
