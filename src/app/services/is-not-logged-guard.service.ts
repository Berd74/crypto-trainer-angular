import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {CanLoad, Route, Router, UrlSegment} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class IsNotLoggedGuardService implements CanLoad {

  constructor(private router: Router) {
    log('IsNotLoggedGuardService');
  }

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    return true;
  }

}
