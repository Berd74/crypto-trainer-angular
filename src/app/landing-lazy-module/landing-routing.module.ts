import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LandingCoreComponent} from './landing-core.component';
import {LandingPageComponent} from './landing-page/landing-page.component';
import {LoginComponent} from './pages/login/login.component';
import {SignUpComponent} from './pages/sign-up/sign-up.component';

export const LANDING_ROUTES: Routes = [
  {
    path: '', component: LandingCoreComponent, children: [
      {path: 'sign-up', component: SignUpComponent},
      {path: 'login', component: LoginComponent},
      {path: 'landing', component: LandingPageComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(LANDING_ROUTES)],
  exports: [RouterModule]
})
export class LandingRoutingModule {
}

