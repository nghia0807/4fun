import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { MonitorComponent } from './pages/monitor/monitor.component';
import { NoPageComponent } from './pages/no-page/no-page.component';

export const routes: Routes = [
    { path: '', redirectTo: '/welcome', pathMatch: 'full' },
    { path: 'welcome', component: WelcomeComponent },
    { path: 'monitor', component: MonitorComponent},
    { path: '**', component: NoPageComponent},
];

@NgModule({
    imports: [ RouterModule.forChild(routes) ],
    exports: [ RouterModule ],
})

export class AppRoutingModule {}