import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {CanLoad, Route, Router, UrlSegment} from '@angular/router';
import {FirebaseAuthService} from './firebase.service';
import {mergeMap, take, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class IsLoggedGuardService implements CanLoad {

  constructor(private router: Router,
              private firebaseAuthService: FirebaseAuthService) {
    logtri('IsLoggedGuardService');
  }

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {

    return this.firebaseAuthService.userStateListener().pipe(
      tap(isLogged => {
        if (!isLogged) {
          this.router.navigate(['login']);
        }
      }),
      mergeMap((isLogged) => of(!!isLogged)),
      take(1)
    );

  }

}
