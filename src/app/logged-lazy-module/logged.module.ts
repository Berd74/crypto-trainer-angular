import {NgModule} from '@angular/core';
import {HomeComponent} from './pages/home/home.component';
import {CommonModule} from '@angular/common';
import {AngularFireModule} from '@angular/fire';
import {AppComponent} from '../app.component';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {ReactiveFormsModule} from '@angular/forms';
import {LoggedCoreComponent} from './logged-core.component';
import {LoggedRoutingModule} from './logged-routing.module';
import {SharedModule} from '../shared-global/shared.module';
import {GraphComponent} from './shared/components/graph/graph.component';


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
  imports: [
    LoggedRoutingModule,
    CommonModule,
    AngularFireModule.initializeApp(config),
    AngularFireAuthModule,
    ReactiveFormsModule,
    // My global shared module (for example it adds default component - no need to declare it below)
    SharedModule
  ],
  declarations: [
    //
    LoggedCoreComponent,
    HomeComponent,
    GraphComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class LoggedModule {

  constructor() {
    logtri('LoggedModule');
  }

}
