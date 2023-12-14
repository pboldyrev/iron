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
} from '@ng-icons/octicons';
import {
  heroBuildingLibrary, 
  heroChevronDown, 
  heroChevronUp, 
  heroRocketLaunch,
  heroBanknotes,
  heroClock,
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
      heroBuildingLibrary,
      heroRocketLaunch,
      heroChevronUp,
      heroChevronDown,
      heroBanknotes,
      heroClock
    }),
  ],
})
export class BluIcon {
  @Input() name!: BluIconName;

  @Input() size: string = '16';

  public bluToIconMap = BluToIconMap;
}
