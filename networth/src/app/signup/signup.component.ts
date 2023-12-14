import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIconComponent } from '@ng-icons/core';
import { BluButton } from 'projects/blueprint/src/lib/button/button.component';
import { BluHeading } from 'projects/blueprint/src/lib/heading/heading.component';
import { BluInput } from 'projects/blueprint/src/lib/input/input.component';
import { BluSpinner } from 'projects/blueprint/src/lib/spinner/spinner.component';
import { BluText } from 'projects/blueprint/src/lib/text/text.component';
import { BTN_TEXTS, TEXTS } from './signup.strings';
import { Router } from '@angular/router';
import { FeedbackType } from 'projects/blueprint/src/lib/common/constants';
import { AuthService } from '../shared/services/auth.service';
import { BehaviorSubject, Observable, combineLatest, map, take } from 'rxjs';
import { SignupType } from './signup.constants';
import { BluModal } from 'projects/blueprint/src/lib/modal/modal.component';

@Component({
  selector: 'app-signup',
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
  ],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent {
  @ViewChild('nameInput') nameInput!: BluInput;
  @ViewChild('emailInput') emailInput!: BluInput;
  @ViewChild('passwordInput') passwordInput!: BluInput;

  public TEXTS = TEXTS;
  public BTN_TEXTS = BTN_TEXTS;
  public FeedbackType = FeedbackType;

  public isSignUpSubmitting$ = new BehaviorSubject<boolean>(false);

  constructor(
    public authService: AuthService,
    private router: Router,
  ) {}

  public onSignUp(): void {
    this.areFieldsValid$().subscribe((signupData: SignupType) => {
      if (signupData) {
        this.authService.signUp(
          signupData.name,
          signupData.email,
          signupData.password,
          this.isSignUpSubmitting$,
        );
      }
    });
  }

  public onToLogin(): void {
    this.router.navigate(['/login']);
  }

  private areFieldsValid$(): Observable<SignupType> {
    this.validateFields();

    return combineLatest([
      this.nameInput.isValid$,
      this.emailInput.isValid$,
      this.passwordInput.isValid$,
      this.nameInput.value$,
      this.emailInput.value$,
      this.passwordInput.value$,
    ]).pipe(
      take(1),
      map(
        ([
          nameValid,
          emailValid,
          passwordValid,
          nameValue,
          emailValue,
          passwordValue,
        ]: [boolean, boolean, boolean, string, string, string]) => {
          if (nameValid && emailValid && passwordValid) {
            return {
              name: nameValue,
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
    this.nameInput.validate();
    this.emailInput.validate();
    this.passwordInput.validate();
  }
}
