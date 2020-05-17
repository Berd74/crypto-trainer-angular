import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ErrorPageComponent} from './error-page/error-page.component';
import {HttpClientModule} from '@angular/common/http';
import {SharedModule} from './shared/shared.module';

@NgModule({

  imports: [
    // Router
    AppRoutingModule,
    // App Modules

    // Other
    HttpClientModule,
    // To make router works
    BrowserModule,
    // My global shared module (for example it adds default component - no need to declare it below)
    SharedModule,
  ],
  declarations: [
    // App Components
    AppComponent,
    ErrorPageComponent
  ],
  exports: [

  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    logtri('AppModule');
  }
}
