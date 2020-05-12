import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DefaultComponent} from './components-module/default/default.component';

@NgModule({
  imports: [
    // CommonModule,
    // FormsModule,
  ],
  declarations: [
    // App Components
    DefaultComponent
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    // App Components
    DefaultComponent
  ]
})
export class SharedModule {
}
