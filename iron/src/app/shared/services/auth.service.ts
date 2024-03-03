import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ToastService } from './toast.service';
import { FeedbackType } from 'projects/blueprint/src/lib/common/constants';
import { environment } from 'src/environments/environment';
import { NavigationService } from './navigation-service.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userData: any;
  constructor(
    public navigationService: NavigationService,
    public ngZone: NgZone,
    private httpClient: HttpClient,
    private toastService: ToastService,
  ) {}

  public submitPhoneNumber$(phoneNumber: number): Observable<string> {
    const formattedNumber = '+1' + phoneNumber.toString();
    return this.httpClient
      .post(
        environment.berry + 'sendPhoneCode',
        {
          phoneNumber: formattedNumber,
        },
        {
          headers: { 'Content-Type': 'application/json' },
        },
      )
      .pipe(
        map((data: any) => {
          return data.method_id;
        }),
      );
  }

  public submitEmail$(email: string): Observable<string> {
    return this.httpClient
      .post(
        environment.berry + 'sendEmailCode',
        {
          email: email,
        },
        {
          headers: { 'Content-Type': 'application/json' },
        },
      )
      .pipe(
        map((data: any) => {
          return data.method_id;
        }),
      );
  }

  public checkEmailCode$(
    methodId: string,
    email: string,
    code: string,
  ): Observable<boolean> {
    return this.httpClient
      .post(
        environment.berry + 'checkEmailCode',
        {
          email: email,
          method_id: methodId,
          otp: code,
        },
        {
          headers: { 'Content-Type': 'application/json' },
        },
      )
      .pipe(
        map((data: any) => {
          localStorage.setItem('sessionToken', data.sessionToken);
          return true;
        }),
      );
  }

  public checkPhoneCode$(
    methodId: string,
    phoneNumber: number,
    code: string,
  ): Observable<boolean> {
    const formattedNumber = '+1' + phoneNumber.toString();

    return this.httpClient
      .post(
        environment.berry + 'checkPhoneCode',
        {
          phoneNumber: formattedNumber,
          method_id: methodId,
          otp: code,
        },
        {
          headers: { 'Content-Type': 'application/json' },
        },
      )
      .pipe(
        map((data: any) => {
          localStorage.setItem('sessionToken', data.sessionToken);
          return true;
        }),
      );
  }

  public signOut(): void {
    try {
      localStorage.removeItem('sessionToken');
      this.navigationService.navigate('/login');
      this.toastService.showToast(
        'You have been logged out',
        FeedbackType.SUCCESS,
      );
    } catch (error) {
      console.log(error);
    }
  }

  public isLoggedIn(): boolean {
    return !!localStorage.getItem('sessionToken');
  }

  public getSessionToken(): string {
    if (this.isLoggedIn()) {
      const token = localStorage.getItem('sessionToken');
      if (token) {
        return token;
      }
      return '';
    }
    return '';
  }
}
