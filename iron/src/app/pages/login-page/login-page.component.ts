import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../shared/services/auth.service';
import { BluButton } from 'projects/blueprint/src/lib/button/button.component';
import { BluHeading } from 'projects/blueprint/src/lib/heading/heading.component';
import { BTN_TEXTS, LABELS, TEXTS, TOOLTIPS } from './login-page.strings';
import { BehaviorSubject, Observable, combineLatest, flatMap, map, mergeMap, of, take, tap } from 'rxjs';
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
import { AnalyticsService } from 'src/app/shared/services/analytics.service';
import { ANALYTICS } from 'src/app/shared/constants/constants';
import { ToastService } from 'src/app/shared/services/toast.service';
import { NavigationService } from 'src/app/shared/services/navigation-service.service';
import { BluLink } from 'projects/blueprint/src/lib/link/link.component';
import { MatTooltipModule } from '@angular/material/tooltip';

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
    BluLink,
    MatTooltipModule,
  ],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent {
  @ViewChild('phoneInput') phoneInput!: BluInput;
  @ViewChild('codeInput') codeInput!: BluInput;
  @ViewChild('inviteCodeInput') inviteCodeInput!: BluInput;

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
    private navigationService: NavigationService,
    private analyticsService: AnalyticsService,
    private toastService: ToastService,
  ) {}

  public onBack(): void {
    this.showOTPDialog = false;
    this.clearAuth();
  }

  public onSendCode(): void {
    this.clearAuth();
    this.isSendCodeSubmitting = true;

    const phone = this.phoneInput.validate();
    const inviteCode = this.inviteCodeInput.validate();

    if (!phone) {
      this.isSendCodeSubmitting = false;
      return;
    }

    if(inviteCode !== '42096') {
      this.isSendCodeSubmitting = false;
      this.inviteCodeInput.customFeedback = "This invite code is incorrect.";
      return;
    }

    this.phoneNumber = parseInt(phone);

    this.authService.submitPhoneNumber$(this.phoneNumber).subscribe({
      next: (methodId: string) => {
        if(methodId === 'invalidInviteCode') {
          this.inviteCodeInput.isValid = false;
          this.inviteCodeInput.customFeedback = "This invite code is incorrect.";
          this.isSendCodeSubmitting = false;
          return;
        }
        if(!methodId) {
          this.isSendCodeSubmitting = false;
          return;
        }
        this.methodId = methodId;
        this.showOTPDialog = true;
        this.analyticsService.track(ANALYTICS.LOGIN_ENTERED_PHONE);
        this.isSendCodeSubmitting = false;
        this.toastService.showToast("Code sent successfully", FeedbackType.SUCCESS);
      },
      error: () => {
        this.phoneInput.customFeedback = TEXTS.UNKNWON_LOGIN_ERROR;
        this.isSendCodeSubmitting = false;
        this.analyticsService.track(ANALYTICS.LOGIN_PHONE_FAILED);
      },
    });
  }

  public onConfirmCode(): void {
    this.error$.next('');
    this.isCheckTokenSubmitting = true;

    const code = this.getCode();

    if(!code){
      this.isCheckTokenSubmitting = false;
      this.error$.next(TEXTS.INCORRECT_CODE);
      return;
    }

    this.authService.checkPhoneCode$(
      this.methodId, this.phoneNumber, code
    ).subscribe({
      next: () => {
        this.navigationService.navigate('/dashboard');
        this.toastService.showToast("Login successful", FeedbackType.SUCCESS);
        this.isCheckTokenSubmitting = false;
        this.analyticsService.track(ANALYTICS.LOGIN_ENTERED_CODE);
      },
      error: (error: HttpErrorResponse) => {
        if(error.status === 400) {
          this.error$.next(TEXTS.INCORRECT_CODE);
        } else {
          this.error$.next(TEXTS.UNKNWON_LOGIN_ERROR);
        }
        this.isCheckTokenSubmitting = false;
        this.analyticsService.track(ANALYTICS.LOGIN_CODE_FAILED);
      },
    });
  }

  private getCode(): string {
    const code = this.codeInput.validate();
    if (code && code.length === 6) {
      return code;
    }
    return '';
  }

  private clearAuth(): void {
    this.phoneNumber = 0;
    this.methodId = '';
  }

  onViewFeatures(): void {
    alert("Not implemented yet!");
  }
}
