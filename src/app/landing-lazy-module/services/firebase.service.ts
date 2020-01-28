import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {User} from 'firebase';
import {mapTo, mergeMap, tap} from 'rxjs/operators';
import {from, Observable, of} from 'rxjs';
import UserCredential = firebase.auth.UserCredential;

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  public user: User;
  public userToken: string;

  constructor(public afAuth: AngularFireAuth) {
    this.userStateListener().subscribe({
      next: () => {
      }
    });
  }

  public async login(email: string, password: string): Promise<UserCredential> {
    return await this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  public signUp(email: string, password: string): Observable<UserCredential> {
    return from(this.afAuth.auth.createUserWithEmailAndPassword(email, password));
  }

  public async logout(): Promise<void> {
    await this.afAuth.auth.signOut();
  }

  public userStateListener(): Observable<User> {
    return this.afAuth.authState.pipe(
      tap(user => {
        console.log('%cUserStateListener Triggered! ', 'color: #00ffff');
        this.user = user;
      }),
      mergeMap(user => this.refreshToken().pipe(mapTo(user)) as Observable<User>),
    );
  }

  public refreshToken(): Observable<string> {
    if (this.user) {
      return from(this.user.getIdToken(true)).pipe(
        tap(token => {
          localStorage.setItem('user_token', token);
          this.userToken = token;
        }),
      );
    } else {
      localStorage.removeItem('user_token');
      this.userToken = null;
      return of(null);
    }
  }
}
