import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { UserDataService, AppointmentData } from '../../../../data/data';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { MainStore } from '../../main-app.component.store';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { AppointmentStatus, ListOfAppointmentStatus } from '../../../../component/enum';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { MonitorComponent } from '../monitor.component';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    NzTableModule,
    NzPopconfirmModule,
    CommonModule,
    NzTagModule,
    NzDividerModule,
    NzMessageModule
  ],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
  providers: [MainStore]
})
export class ListComponent implements OnInit {
  appointments: AppointmentData[] = [];
  readonly blured$ = this.mainStore.bluredSlider$;

  constructor(
    private userDataService: UserDataService,
    private mainStore: MainStore,
    private messageService: NzMessageService,
    private viewAppointment: MonitorComponent
  ) { }

  async ngOnInit() {
    await this.loadAppointments();
  }

  async loadAppointments() {
    this.appointments = await this.userDataService.getUserAppointments(null);
  }

  getStatusConfig(status: AppointmentStatus) {
    return ListOfAppointmentStatus.find(item => item.value === status);
  }

  viewAppointmentDetails(appointment: AppointmentData) {
    this.viewAppointment.openDrawer(appointment);
  }

  async cancelAppointment(appointment: AppointmentData) {
    try {
      // Parse the appointment date
      const appointmentDate = new Date(appointment.appointmentDate);
      const today = new Date();

      // Calculate the difference in days
      const timeDifference = appointmentDate.getTime() - today.getTime();
      const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));

      // Check if the appointment is at least 2 days away
      if (daysDifference < 2) {
        this.messageService.error('Appointments can only be canceled at least 2 days in advance.');
        return;
      }

      // Proceed with cancellation
      await this.userDataService.cancelAppointment(appointment.id);
      await this.loadAppointments();
      this.messageService.success('Appointment canceled successfully.');
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      this.messageService.error('Failed to cancel appointment. Please try again.');
    }
  }
}
