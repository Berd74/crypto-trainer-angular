import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoggedCoreComponent} from './logged-core.component';
import {HomeComponent} from './pages/home/home.component';
import {ListComponent} from './pages/list/list.component';
import {HistoryComponent} from './pages/history/history.component';
import {CoinDetailsComponent} from './pages/coin-details/coin-details.component';
import {PortfolioDetailsComponent} from './pages/portfolio-details/portfolio-details.component';

export const LOGGED_ROUTES: Routes = [
  {
    path: '', component: LoggedCoreComponent, children: [
      {path: 'home', component: HomeComponent},
      {path: 'list', component: ListComponent},
      {path: 'portfolio/:id', component: PortfolioDetailsComponent},
      {path: 'history', component: HistoryComponent},
      {path: 'coin-details/:id', component: CoinDetailsComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(LOGGED_ROUTES)],
  exports: [RouterModule]
})
export class LoggedRoutingModule {
}

