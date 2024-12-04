import { Component } from '@angular/core';
import { ListComponent } from './list/list.component';
import { HistoryListComponent } from './history-list/history-list.component';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { CommonModule } from '@angular/common';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { AppointmentData } from '../../../data/data';
import { NzMessageModule } from 'ng-zorro-antd/message';
@Component({
  selector: 'app-monitor',
  standalone: true,
  imports: [
    ListComponent,
    HistoryListComponent,
    NzDrawerModule,
    CommonModule,
    NzTagModule,
    NzMessageModule
  ],
  templateUrl: './monitor.component.html',
  styleUrl: './monitor.component.css'
})
export class MonitorComponent {
  visibleView = false;
  selectedAppointment: AppointmentData | null = null;

  openDrawer(appointment: AppointmentData) {
    this.selectedAppointment = appointment;
    this.visibleView = true;
  }

  closeDrawer() {
    this.visibleView = false;
    this.selectedAppointment = null;
  }

}
