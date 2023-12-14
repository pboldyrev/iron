import { Injectable, NgZone } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { User } from '../interfaces/interfaces';
import { BehaviorSubject, throwError } from 'rxjs';
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
    email: string,
    password: string,
    isSubmitting$: BehaviorSubject<boolean>,
  ) {
    isSubmitting$.next(true);
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.setUserData(result.user);
        this.afAuth.authState.subscribe((user) => {
          if (user) {
            this.router.navigate(['overview']);
          }
          isSubmitting$.next(false);
        });
      })
      .catch((err: unknown) => {
        isSubmitting$.next(false);

        if(err instanceof FirebaseError) {
          throw new Error(err.code);
        } else {
          throw new Error("auth/unknown");
        }
      });
  }

  public signUp(
    name: string,
    email: string,
    password: string,
    isSubmitting$: BehaviorSubject<boolean>,
  ) {
    isSubmitting$.next(true);
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result: any) => {
        result.user
          .updateProfile({
            displayName: name,
          })
          .then(() => {
            this.setUserData(result.user);
            this.router.navigate(['/overview']);
            isSubmitting$.next(false);
          });
      })
      .catch((error) => {
        console.log(error);
        isSubmitting$.next(false);
      });
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
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
    };
    return userRef.set(userData, {
      merge: true,
    });
  }
}
