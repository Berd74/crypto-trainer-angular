import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {CanLoad, Route, Router, UrlSegment} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class IsLoggedGuardService implements CanLoad {

  constructor(private router: Router) {
    logtri('IsLoggedGuardService');
  }

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    return true;
  }

}
