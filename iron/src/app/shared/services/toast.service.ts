import { Injectable, NgZone } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastType } from '../constants/constants';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(
    private snackBar: MatSnackBar,
    private zone: NgZone
  ) {}

  public showToast(message: string, type: ToastType, duration = 5000): void {
    this.zone.run(() => {
      this.snackBar.open(message, undefined, { 
        duration: duration,
        panelClass: ['blu-toast', 'blu-toast-' + type],
      });
    });
  }
}
