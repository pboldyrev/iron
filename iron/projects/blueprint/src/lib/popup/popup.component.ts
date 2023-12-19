import { Component, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { BluButton } from '../button/button.component';
import { BluHeading } from '../heading/heading.component';
import { BluIcon } from '../icon/icon.component';

@Component({
  selector: 'blu-popup',
  standalone: true,
  imports: [CommonModule, BluButton, BluHeading, BluIcon],
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css'],
})
export class BluPopup {
  @Input() size!: 'large' | 'medium' | 'small' | 'x-large';

  @Input() title: string = '';
  @Input() subtitle: string = '';

  @Output() closed$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public show$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public hide(): void {
    this.show$.next(false);
    this.closed$.next(true);
  }

  public show(): void {
    this.show$.next(true);
  }
}
