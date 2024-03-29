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
  heroRocketLaunch,
  heroBanknotes,
  heroClock,
  heroArrowPath,
  heroTrash,
  heroArrowLeft,
  heroArrowTrendingUp,
  heroArrowTrendingDown,
  heroCurrencyDollar,
  heroEyeSlash,
  heroEye,
  heroChatBubbleOvalLeft,
  heroDocumentArrowUp,
  heroArrowLeftOnRectangle,
  heroArrowRightOnRectangle,
  heroPower,
} from '@ng-icons/heroicons/outline';
import {
  lucideCar,
} from '@ng-icons/lucide';
import {
  circumFileOn,
} from '@ng-icons/circum-icons';
import {
  ionMenuOutline
} from '@ng-icons/ionicons';
import {
  iconoirPiggyBank
} from '@ng-icons/iconoir';
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
      heroBanknotes,
      heroClock,
      heroArrowPath,
      heroTrash,
      heroArrowLeft,
      heroArrowTrendingUp,
      heroArrowTrendingDown,
      heroCurrencyDollar,
      heroEyeSlash,
      heroEye,
      heroChatBubbleOvalLeft,
      lucideCar,
      heroDocumentArrowUp,
      circumFileOn,
      ionMenuOutline,
      heroArrowLeftOnRectangle,
      heroArrowRightOnRectangle,
      heroPower,
      iconoirPiggyBank,
    }),
  ],
})
export class BluIcon {
  @Input() name!: BluIconName;

  @Input() size: string = '16';
  @Input() type: 'success' | 'error' | 'info' | 'primary' | null = null;

  public bluToIconMap = BluToIconMap;
}
