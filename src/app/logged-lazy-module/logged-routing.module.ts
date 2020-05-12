import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoggedCoreComponent} from './logged-core.component';
import {HomeComponent} from './pages/home/home.component';

export const LOGGED_ROUTES: Routes = [
  {
    path: '', component: LoggedCoreComponent, children: [
      {path: 'home', component: HomeComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(LOGGED_ROUTES)],
  exports: [RouterModule]
})
export class LoggedRoutingModule {
}

