import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../shared/services/auth.service';
import { BluButton } from 'projects/blueprint/src/lib/button/button.component';
import { BluHeading } from 'projects/blueprint/src/lib/heading/heading.component';
import { BTN_TEXTS, TEXTS } from './login.strings';
import { BehaviorSubject, Observable, combineLatest, map, take } from 'rxjs';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { BluSpinner } from 'projects/blueprint/src/lib/spinner/spinner.component';
import { FEEDBACK_STRINGS } from '../shared/constants/strings';
import { FeedbackType } from 'projects/blueprint/src/lib/common/constants';
import { BluInput } from 'projects/blueprint/src/lib/input/input.component';
import { ERRORS, LoginType } from './login.constants';
import { Router } from '@angular/router';
import { BluText } from 'projects/blueprint/src/lib/text/text.component';
import { BluModal } from 'projects/blueprint/src/lib/modal/modal.component';
import { BluValidationFeedback } from 'projects/blueprint/src/lib/validation-popup/validation-feedback.component';

@Component({
  selector: 'app-login',
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
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  @ViewChild('emailInput') emailInput!: BluInput;
  @ViewChild('passwordInput') passwordInput!: BluInput;

  public TEXTS = TEXTS;
  public BTN_TEXTS = BTN_TEXTS;
  public FEEDBACK_STRINGS = FEEDBACK_STRINGS;
  public FeedbackType = FeedbackType;

  public isSignInSubmitting$ = new BehaviorSubject<boolean>(false);
  public invalidLogin$ = new BehaviorSubject<boolean>(false);
  public unknownLoginError$ = new BehaviorSubject<boolean>(false);

  constructor(
    public authService: AuthService,
    private router: Router,
  ) {}

  public onSignIn(): void {
    this.clearErrors();
    this.areFieldsValid$().subscribe((loginData: LoginType) => {
      if (loginData) {
        this.authService.signIn(
          loginData.email,
          loginData.password,
          this.isSignInSubmitting$,
        ).catch((err: Error) => {
          if(err.message === ERRORS.INVALID_LOGIN || err.message === ERRORS.INVALID_LOGIN_2) {
            this.invalidLogin$.next(true);
          } else {
            this.unknownLoginError$.next(true);
          }
        })
      }
    });
  }

  public onSignUp(): void {
    this.router.navigate(['/signup']);
  }

  public clearErrors(): void {
    this.invalidLogin$.next(false);
    this.unknownLoginError$.next(false);
  }

  private areFieldsValid$(): Observable<LoginType> {
    this.validateFields();

    return combineLatest([
      this.emailInput.isValid$,
      this.emailInput.value$,
      this.passwordInput.isValid$,
      this.passwordInput.value$,
    ]).pipe(
      take(1),
      map(
        ([emailValid, emailValue, passwordValid, passwordValue]: [
          boolean,
          string,
          boolean,
          string,
        ]) => {
          if (emailValid && passwordValid) {
            return {
              email: emailValue,
              password: passwordValue,
            };
          }
          return null;
        },
      ),
    );
  }

  private validateFields(): void {
    this.emailInput.validate();
    this.passwordInput.validate();
  }
}
