import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map, } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ToastService } from './toast.service';
import { ToastType } from '../constants/constants';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userData: any;
  constructor(
    public router: Router,
    public ngZone: NgZone,
    private httpClient: HttpClient,
    private toastService: ToastService,
  ) {
  }

  public submitPhoneNumber$(
    phoneNumber: number,
  ): Observable<string> {
    const formattedNumber = '+1' + phoneNumber.toString();
    return this.httpClient.post(
      "https://83ulpu3ica.execute-api.us-west-2.amazonaws.com/Stage/sendPhoneCode",
      {
        phoneNumber: formattedNumber
      },
      {
        headers: {'Content-Type': 'application/json'},
      }
    ).pipe(
      map((data: any) => {
        return data.method_id;
      })
    )
  }

  public checkPhoneCode$(
    methodId: string,
    phoneNumber: number,
    code: string,
  ): Observable<boolean> {
    const formattedNumber = '+1' + phoneNumber.toString();

    return this.httpClient.post(
      "https://83ulpu3ica.execute-api.us-west-2.amazonaws.com/Stage/checkPhoneCode",
      {
        phoneNumber: formattedNumber,
        method_id: methodId,
        otp: code
      },
      {
        headers: {'Content-Type': 'application/json'},
      }
    ).pipe(
      map((data: any) => {
        localStorage.setItem('sessionToken', data.sessionToken);
        return true;
      })
    )
  }

  public signOut(): void {
    try {
      localStorage.removeItem('sessionToken')
      this.router.navigate(['/login']);
      this.toastService.showToast("You have been logged out", ToastType.Success);
    } catch (error) {
      console.log(error);
    }
  }

  public isLoggedIn(): boolean {
    return !!localStorage.getItem('sessionToken');
  }

  public getSessionToken(): string {
    if(this.isLoggedIn()) {
      const token = localStorage.getItem('sessionToken');
      if(token) {
        return token;
      }
      return ''
    }
    return '';
  }
}
