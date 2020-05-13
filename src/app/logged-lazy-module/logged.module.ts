import {NgModule} from '@angular/core';
import {HomeComponent} from './pages/home/home.component';
import {CommonModule} from '@angular/common';
import {AppComponent} from '../app.component';
import {ReactiveFormsModule} from '@angular/forms';
import {LoggedCoreComponent} from './logged-core.component';
import {LoggedRoutingModule} from './logged-routing.module';
import {SharedModule} from '../shared/shared.module';
import {GraphComponent} from './components/graph/graph.component';
import {SidebarComponent} from './components/sidebar/sidebar.component';


@NgModule({
  imports: [
    // Essential
    CommonModule,
    ReactiveFormsModule,
    // Routing
    LoggedRoutingModule,
    // My global shared module (for example it adds default component - no need to declare it below)
    SharedModule
  ],
  declarations: [
    // Components/Pages
    LoggedCoreComponent,
    HomeComponent,
    GraphComponent,
    SidebarComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class LoggedModule {

  constructor() {
    logtri('LoggedModule');
  }

}
