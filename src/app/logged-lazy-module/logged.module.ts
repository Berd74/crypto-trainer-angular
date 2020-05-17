import {NgModule} from '@angular/core';
import {HomeComponent} from './pages/home/home.component';
import {CommonModule, DatePipe} from '@angular/common';
import {AppComponent} from '../app.component';
import {ReactiveFormsModule} from '@angular/forms';
import {LoggedCoreComponent} from './logged-core.component';
import {LoggedRoutingModule} from './logged-routing.module';
import {SharedModule} from '../shared/shared.module';
import {GraphComponent} from './components/graph/graph.component';
import {SidebarComponent} from './components/sidebar/sidebar.component';
import {ListComponent} from './pages/list/list.component';
import {HistoryComponent} from './pages/history/history.component';
import {LoggedProvidersModule} from './logged-providers.module';
import {CoinDetailsComponent} from './pages/coin-details/coin-details.component';
import {StartModal} from './modals/test/start.modal';
import {BuyModal} from './modals/buy/buy.modal';
import {FloatPipe} from './pipes/round.pipe';

@NgModule({
  imports: [
    // Essential
    CommonModule,
    ReactiveFormsModule,
    // Routing
    LoggedRoutingModule,
    // My global shared module (for example it adds default component - no need to declare it below)
    SharedModule,
    // Providers Module
    LoggedProvidersModule
  ],
  declarations: [
    // Components/Pages
    LoggedCoreComponent,
    HomeComponent,
    GraphComponent,
    SidebarComponent,
    HistoryComponent,
    ListComponent,
    CoinDetailsComponent,
    // Modals
    StartModal,
    BuyModal,
    // Pipies
    FloatPipe
  ],
  providers: [DatePipe],
  entryComponents: [
    StartModal,
    BuyModal
  ],
  bootstrap: [
    AppComponent
  ]
})
export class LoggedModule {

  constructor() {
    logtri('LoggedModule');
  }

}
