import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ErrorPageComponent} from './error-page/error-page.component';


const routes: Routes = [
  {path: '', redirectTo: 'landing_page', pathMatch: 'full'},
  {path: 'error', component: ErrorPageComponent},
  {path: '**', redirectTo: 'landing_page'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
