import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {User} from 'firebase';
import {mapTo, mergeMap, tap} from 'rxjs/operators';
import {from, Observable, of} from 'rxjs';
import {Router} from '@angular/router';
import UserCredential = firebase.auth.UserCredential;

@Injectable({
  providedIn: 'root'
})
export class FirebaseAuthService {
  public user: User;
  public userToken: string;

  constructor(private afAuth: AngularFireAuth, private router: Router) {
    logtri('FirebaseService');
    this.userStateListener().subscribe({
      next: () => {
      }
    });
  }

  public login(email: string, password: string): Observable<UserCredential> {

    return from(this.afAuth.auth.signInWithEmailAndPassword(email, password)).pipe(
      tap(() => {
        this.router.navigate(['dashboard']);
      })
    );
  }

  public signUp(email: string, password: string): Observable<UserCredential> {
    return from(this.afAuth.auth.createUserWithEmailAndPassword(email, password)).pipe(
      tap(() => {
        this.router.navigate(['dashboard']);
      })
    );
  }

  public async logout(): Promise<void> {
    await this.afAuth.auth.signOut();
    localStorage.removeItem('user_token');
    location.reload();
  }

  public userStateListener(): Observable<User> {
    return this.afAuth.authState.pipe(
      tap(user => {
        logtri('userStateListener function');
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
