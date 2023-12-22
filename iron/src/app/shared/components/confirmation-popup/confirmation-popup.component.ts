import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { BluButton } from 'projects/blueprint/src/lib/button/button.component';
import { BluPopup } from 'projects/blueprint/src/lib/popup/popup.component';
import { BluText } from 'projects/blueprint/src/lib/text/text.component';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-confirmation-popup',
  standalone: true,
  imports: [CommonModule, BluPopup, BluButton, BluText],
  templateUrl: './confirmation-popup.component.html',
  styleUrl: './confirmation-popup.component.scss'
})
export class ConfirmationPopupComponent {
  @ViewChild('popup') popup!: BluPopup;

  @Input() title!: string;

  @Input() subtitle: string = '';
  @Input() confirmText: string = 'Confirm';
  @Input() size: 'small' | 'medium' | 'large' | 'x-large' = 'medium';

  @Output() confirmed: EventEmitter<boolean> = new EventEmitter();

  public onConfirm() {
    this.confirmed.emit();
    this.popup.hide();
  }

  public show(): void {
    this.popup.show();
  }
}
