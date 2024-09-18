import { Routes, RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MainAppComponent } from './pages/main-app.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { MonitorComponent } from './pages/monitor/monitor.component';
import { NopageComponent } from './pages/nopage/nopage.component';
import { DoctorComponent } from './pages/doctor/doctor.component';
import { authGuard } from './pages/auth.guard';

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
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'welcome',
        pathMatch:'full'
      },
      {
        path: 'welcome',
        component: WelcomeComponent
      },
      {
        path: 'monitor',
        component: MonitorComponent,
      },
      {
        path: 'doctor',
        component: DoctorComponent
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