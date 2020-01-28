import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ErrorPageComponent} from './error-page/error-page.component';
import {HttpClientModule} from '@angular/common/http';
import {LandingModule} from './landing-lazy-module/landing.module';

@NgModule({
  declarations: [
    AppComponent,
    ErrorPageComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    LandingModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
