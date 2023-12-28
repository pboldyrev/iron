import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../shared/services/auth.service';
import { BluButton } from 'projects/blueprint/src/lib/button/button.component';
import { BluHeading } from 'projects/blueprint/src/lib/heading/heading.component';
import { BTN_TEXTS, LABELS, TEXTS, TOOLTIPS } from './login-page.strings';
import { BehaviorSubject, Observable, combineLatest, map, take, tap } from 'rxjs';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { BluSpinner } from 'projects/blueprint/src/lib/spinner/spinner.component';
import { FEEDBACK_STRINGS } from '../../shared/constants/strings';
import { FeedbackType } from 'projects/blueprint/src/lib/common/constants';
import { BluInput } from 'projects/blueprint/src/lib/input/input.component';
import { Router } from '@angular/router';
import { BluText } from 'projects/blueprint/src/lib/text/text.component';
import { BluModal } from 'projects/blueprint/src/lib/modal/modal.component';
import { BluValidationFeedback } from 'projects/blueprint/src/lib/validation-popup/validation-feedback.component';
import { HttpErrorResponse } from '@angular/common/http';
import { MixpanelService } from 'src/app/shared/services/mixpanel.service';
import { MIXPANEL } from 'src/app/shared/constants/constants';
import { ToastService } from 'src/app/shared/services/toast.service';
import { FooterComponent } from 'src/app/footer/footer.component';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    CommonModule,
    BluInput,
    BluButton,
    BluHeading,
    BluSpinner,
    NgIconComponent,
    BluText,
    BluModal,
    BluValidationFeedback,
    FooterComponent
  ],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent {
  @ViewChild('phoneInput') phoneInput!: BluInput;
  @ViewChild('codeInput') codeInput!: BluInput;

  public TEXTS = TEXTS;
  public BTN_TEXTS = BTN_TEXTS;
  public LABELS = LABELS;
  public TOOLTIPS = TOOLTIPS;
  public FeedbackType = FeedbackType;

  public isSendCodeSubmitting = false;
  public isCheckTokenSubmitting = false;
  public error$ = new BehaviorSubject<string>('');
  public showOTPDialog = false;

  private methodId: string = '';
  private phoneNumber: number = 0;

  constructor(
    private authService: AuthService,
    private router: Router,
    private mixpanelService: MixpanelService,
    private toastService: ToastService,
  ) {}

  public onBack(): void {
    this.showOTPDialog = false;
    this.error$.next('');
    this.clearAuth();
  }

  public onSendCode(): void {
    this.clearAuth();
    this.error$.next('');
    this.isSendCodeSubmitting = true;

    this.phoneInput.validate$().subscribe((phoneNumber: string) => {
      if (!phoneNumber) {
        this.isSendCodeSubmitting = false;
        return;
      }

      this.authService.submitPhoneNumber$(
        parseInt(phoneNumber)
      ).subscribe({
        next: (methodId: string) => {
          this.methodId = methodId;
          this.phoneNumber = parseInt(phoneNumber);
          this.showOTPDialog = true;
          this.mixpanelService.track(MIXPANEL.LOGIN_ENTERED_PHONE);
          this.isSendCodeSubmitting = false;
          this.toastService.showToast("Code sent successfully", FeedbackType.SUCCESS);
        },
        error: () => {
          this.error$.next(TEXTS.UNKNWON_LOGIN_ERROR);
          this.isSendCodeSubmitting = false;
          this.mixpanelService.track(MIXPANEL.LOGIN_PHONE_FAILED);
        },
      });
    });
  }

  public onConfirmCode(): void {
    this.error$.next('');
    this.isCheckTokenSubmitting = true;
    this.isCodeValid$().subscribe((code: string) => {
      if(!code){
        this.isCheckTokenSubmitting = false;
        this.error$.next(TEXTS.INCORRECT_CODE);
        return;
      }

      this.authService.checkPhoneCode$(
        this.methodId, this.phoneNumber, code
      ).subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
          this.toastService.showToast("Login successful", FeedbackType.SUCCESS);
          this.isCheckTokenSubmitting = false;
          this.mixpanelService.track(MIXPANEL.LOGIN_ENTERED_CODE);
        },
        error: (error: HttpErrorResponse) => {
          if(error.status === 400) {
            this.error$.next(TEXTS.INCORRECT_CODE);
          } else {
            this.error$.next(TEXTS.UNKNWON_LOGIN_ERROR);
          }
          this.isCheckTokenSubmitting = false;
          this.mixpanelService.track(MIXPANEL.LOGIN_CODE_FAILED);
        },
      });
    });
  }

  private isCodeValid$(): Observable<string> {
    return this.codeInput.validate$().pipe(
      take(1),
      map(
        (codeValue: string) => {
          if (codeValue && codeValue.length === 6) {
            return codeValue;
          }
          return '';
        },
      ),
    );
  }

  private clearAuth(): void {
    this.phoneNumber = 0;
    this.methodId = '';
  }
}
