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
import { ERRORS } from './login.constants';
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
  @ViewChild('phoneInput') phoneInput!: BluInput;

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
    this.areFieldsValid$().subscribe((phoneNumber: number) => {
      if (phoneNumber) {
        this.authService.signIn(
          phoneNumber
        ).subscribe((isSuccess: boolean) => {
          this.router.navigate(['overview']);
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

  private areFieldsValid$(): Observable<number> {
    this.validateFields();

    return combineLatest([
      this.phoneInput.isValid$,
      this.phoneInput.value$,
    ]).pipe(
      take(1),
      map(
        ([phoneValid, phoneValue]: [
          boolean,
          string,
        ]) => {
          if (phoneValid && phoneValid) {
            return parseInt(phoneValue);
          }
          return 0;
        },
      ),
    );
  }

  private validateFields(): void {
    this.phoneInput.validate();
  }
}
