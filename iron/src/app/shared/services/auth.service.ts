import { Injectable, NgZone } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { User } from '../interfaces/interfaces';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { FirebaseError } from 'firebase/app';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userData: any;
  constructor(
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    public router: Router,
    public ngZone: NgZone,
  ) {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user')!);
      } else {
        localStorage.setItem('user', 'null');
        JSON.parse(localStorage.getItem('user')!);
      }
    });
  }

  public signIn(
    phoneNumber: number,
  ): Observable<boolean> {
    const formattedNumber = '+1' + phoneNumber.toString()
    console.log(formattedNumber);
    this.setUserData({uid: "123"});
    return of(true);
  }

  public signOut() {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['/login']);
    });
  }

  public isLoggedIn(): boolean {
    const user: User = JSON.parse(localStorage.getItem('user')!);
    return !!user;
  }

  public getCurrentUserId(): string {
    if(this.isLoggedIn()) {
      return JSON.parse(localStorage.getItem('user')!).uid;
    }
    
    return "";
  }

  private setUserData(user: any) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.uid}`,
    );
    const userData = {
      uid: user.uid,
    };
    return userRef.set(userData, {
      merge: true,
    });
  }
}
