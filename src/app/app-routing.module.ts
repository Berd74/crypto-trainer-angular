import {NgModule} from '@angular/core';
import {RouterModule, Routes, UrlMatchResult, UrlSegment} from '@angular/router';
import {ErrorPageComponent} from './error-page/error-page.component';
import {IsLoggedGuardService} from './services/is-logged-guard.service';
import {IsNotLoggedGuardService} from './services/is-not-logged-guard.service';

const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {
    matcher: isLoggedModulePath,
    loadChildren: () => import('./logged-lazy-module/logged.module').then(m => m.LoggedModule),
    canLoad: [IsLoggedGuardService]
  },
  {
    matcher: isLandingModulePath,
    loadChildren: () => import('./landing-lazy-module/landing.module').then(m => m.LandingModule),
    canLoad: [IsNotLoggedGuardService]
  },
  {path: 'error', component: ErrorPageComponent},
  {path: '**', redirectTo: 'home'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

export function isLoggedModulePath(urlSegments: UrlSegment[]) {
  const allowedPaths = [
    'history',
    'list',
    'coin-details',
    'portfolio',
    'home',
  ];

  const isDashboard = urlSegments.find(urlSegment => {
    return allowedPaths.includes(urlSegment.path);
  });

  const posParamsObj = {};
  urlSegments.forEach(urlSegment => {
    posParamsObj[urlSegment.path] = urlSegment;
  });
  return isDashboard ? {consumed: [], posParams: posParamsObj} : null;
}

export function isLandingModulePath(urlSegments: UrlSegment[]): UrlMatchResult {

  const allowedPaths = [
    'landing',
    'login',
    'sign-up',
  ];

  const isLogin = urlSegments.find(urlSegment => {
    return allowedPaths.includes(urlSegment.path);
  });

  const posParamsObj = {};

  urlSegments.forEach(urlSegment => {
    posParamsObj[urlSegment.path] = urlSegment;
  });
  return isLogin ? {consumed: [], posParams: posParamsObj} : null;
}
