import {NgModule} from '@angular/core';
import {SharedModule} from './shared.module';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [],
  exports: [
    SharedModule
  ]
})
export class SharedTestModule {
}
