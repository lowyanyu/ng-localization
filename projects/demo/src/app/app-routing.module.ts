import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { InfoComponent } from './pages/info/info.component';

const routes: Routes = [
  { path: 'home', loadChildren: () => import('./modules/home/home.module').then(mod => mod.HomeModule)},
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: AppComponent },
  { path: 'info', component: InfoComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
