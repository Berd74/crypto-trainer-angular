import {NgModule} from '@angular/core';

import {LandingCoreComponent} from './landing-core.component';
import {LandingRoutingModule} from './landing-routing.module';
import {AppComponent} from '../app.component';
import {LandingPageComponent} from './landing-page/landing-page.component';
import {CommonModule} from '@angular/common';
import {AngularFireModule} from '@angular/fire';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {ReactiveFormsModule} from '@angular/forms';

const config = {
  apiKey: 'AIzaSyC_Ogl0SgARhcYEmHK9Fsn5zhcnr5ATOSg',
  authDomain: 'cryptotrainer.firebaseapp.com',
  databaseURL: 'https://cryptotrainer.firebaseio.com',
  projectId: 'cryptotrainer',
  storageBucket: 'cryptotrainer.appspot.com',
  messagingSenderId: '881041485676',
  appId: '1:881041485676:web:2134a5c3b1b4ec85d5cd49',
  measurementId: 'G-NTGDE9GPT7'
};

@NgModule({
  declarations: [
    LandingPageComponent,
    LandingCoreComponent,
  ],
  imports: [
    CommonModule,
    LandingRoutingModule,
    AngularFireModule.initializeApp(config),
    AngularFireAuthModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class LandingModule {
}
