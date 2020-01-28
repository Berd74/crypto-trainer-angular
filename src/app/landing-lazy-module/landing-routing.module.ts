import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LandingCoreComponent} from './landing-core.component';
import {LandingPageComponent} from './landing-page/landing-page.component';

export const LANDING_ROUTES: Routes = [
  {
    path: '', component: LandingCoreComponent, children: [
      {path: 'landing_page', component: LandingPageComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(LANDING_ROUTES)],
  exports: [RouterModule]
})
export class LandingRoutingModule {
}

