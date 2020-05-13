import {NgModule} from '@angular/core';

import {LandingCoreComponent} from './landing-core.component';
import {LandingRoutingModule} from './landing-routing.module';
import {AppComponent} from '../app.component';
import {LandingPageComponent} from './landing-page/landing-page.component';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {SharedTestModule} from '../shared/shared-test.module';
import {LandingProvidersModule} from './landing-providers.module';
import {LoginComponent} from './pages/login/login.component';
import {SignUpComponent} from './pages/sign-up/sign-up.component';

@NgModule({
  imports: [
    // Routing
    LandingRoutingModule,
    // Essential
    CommonModule,
    ReactiveFormsModule,
    // An example how modules can pass components (defaultComponent -> SharedModule -> SharedTestModule -> this)
    SharedTestModule,
    // Providers Module
    LandingProvidersModule
  ],
  declarations: [
    // Components/Pages
    LandingPageComponent,
    LandingCoreComponent,
    LoginComponent,
    SignUpComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class LandingModule {

  constructor() {
    logtri('LandingModule');
  }

}
