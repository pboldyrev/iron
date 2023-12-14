import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { BluButton } from 'projects/blueprint/src/lib/button/button.component';
import { SidebarOption } from '../shared/interfaces/interfaces';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { TEXTS } from './sidebar.strings';
import { BluPopup } from 'projects/blueprint/src/lib/popup/popup.component';
import { BluIcon } from 'projects/blueprint/src/lib/icon/icon.component';
import { BluHeading } from 'projects/blueprint/src/lib/heading/heading.component';
import { ConfirmationPopupComponent } from '../confirmation-popup/confirmation-popup.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, BluButton, BluPopup, BluIcon, BluHeading, ConfirmationPopupComponent],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  @Input() options!: SidebarOption[];

  public TEXTS = TEXTS;

  public showSignOutModal$ = new BehaviorSubject<boolean>(false);

  constructor(
    public router: Router,
    public authService: AuthService,
  ) {}

  onOptionClick(selected: SidebarOption) {
    this.router.navigate([selected.link]);
  }

  onLogIn() {
    this.router.navigate(['/login']);
  }

  onLogOut() {
    this.authService.signOut();
    this.onCloseModal();
  }

  onOpenModal() {
    this.showSignOutModal$.next(true);
  }

  onCloseModal() {
    this.showSignOutModal$.next(false);
  }
}
