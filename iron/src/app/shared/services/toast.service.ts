import { Injectable, NgZone } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FeedbackType } from 'projects/blueprint/src/lib/common/constants';
import { BluToast } from 'projects/blueprint/src/lib/toast/toast.component';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(
    private snackBar: MatSnackBar,
    private zone: NgZone
  ) {}

  public showToast(message: string, type: FeedbackType): void {
    this.zone.run(() => {
      this.snackBar.openFromComponent(BluToast,
      {
        duration: 5000,
        data: {
          type: type,
          message: message,
        }
      });
    });
  }
}
