import { Routes, RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MainAppComponent } from './pages/main-app.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { LoginComponent } from './pages/login/login.component';
import { register } from 'module';
import { RegisterComponent } from './pages/register/register.component';
import { monitorEventLoopDelay } from 'perf_hooks';
import { MonitorComponent } from './pages/monitor/monitor.component';
import { NopageComponent } from './pages/nopage/nopage.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/login'
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'main',
    component: MainAppComponent,
    children: [
      {
        path: 'welcome',
        component: WelcomeComponent
      },
      {
        path: 'monitor',
        component: MonitorComponent,
      },
      {
        path: '**',
        component: NopageComponent
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }