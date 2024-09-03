import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { MonitorComponent } from './pages/monitor/monitor.component';
import { NoPageComponent } from './pages/no-page/no-page.component';
import { LoginComponent } from './pages/login/login.component';
import { AppComponent } from './app.component';

export const routes: Routes = [
    {
      path: '',
      component: AppComponent,
      children: [
        { path: '', redirectTo: 'welcome', pathMatch: 'full' },
        { path: 'welcome', component: WelcomeComponent },
        { path: 'monitor', component: MonitorComponent },
        { path: '**', component: NoPageComponent },
      ]
    },
    { path: 'login', component: LoginComponent },
  ];

@NgModule({
    imports: [ RouterModule.forChild(routes) ],
    exports: [ RouterModule ],
})

export class AppRoutingModule {}