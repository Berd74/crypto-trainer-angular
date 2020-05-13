import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DefaultComponent} from './components/default/default.component';
import {AngularFireModule} from '@angular/fire';
import {AngularFireDatabaseModule} from '@angular/fire/database';
import {AngularFireAuthModule} from '@angular/fire/auth';

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
    // CommonModule,
    // FormsModule,
    // Firebase
    AngularFireModule.initializeApp(config),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  declarations: [
    // App Components
    DefaultComponent
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    // App Components
    DefaultComponent,
    // Firebase
    AngularFireModule,
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ]
})
export class SharedModule {
}
