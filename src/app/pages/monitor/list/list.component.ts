import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { UserDataService, Appointment } from '../../../../data/data';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { MainStore } from '../../main-app.component.store';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { AppointmentStatus, ListOfAppointmentStatus } from '../../../../component/enum';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { MonitorComponent } from '../monitor.component';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    NzTableModule, 
    NzPopconfirmModule, 
    CommonModule, 
    NzTagModule,
    NzDividerModule,
    NzMessageModule,
    NzPaginationModule
  ],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
  providers: [MainStore]
})
export class ListComponent implements OnInit {
  appointments: Appointment[] = [];
  readonly blured$ = this.mainStore.bluredSlider$;
  pageSize = 5; // Số items trên mỗi trang
  total = 0;
  pageIndex = 1; // Trang hiện tại
  get paginatedAppointments(): Appointment[] {
    const startIndex = (this.pageIndex - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.appointments.slice(startIndex, endIndex);
  }
  constructor(
    private userDataService: UserDataService,
    private mainStore: MainStore,
    private messageService: NzMessageService,
    private viewAppointment: MonitorComponent
  ) { }

  async ngOnInit() {
    await this.loadAppointments();
    this.updateTotal();
  }

  updateTotal() {
    this.total = this.appointments.length;
  }


  async loadAppointments() {
    this.appointments = await this.userDataService.getAppointments();
    this.updateTotal();
  }

  getStatusConfig(status: AppointmentStatus) {
    return ListOfAppointmentStatus.find(item => item.value === status);
  }

  viewAppointmentDetails(appointment: Appointment) {
    this.viewAppointment.openDrawer(appointment);
  }

  async cancelAppointment(appointment: Appointment) {
    try {
      // Parse the appointment date
      const appointmentDate = new Date(appointment.date);
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
      await this.userDataService.cancelAppointment(appointment.key);
      await this.loadAppointments();
      this.messageService.success('Appointment canceled successfully.');
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      this.messageService.error('Failed to cancel appointment. Please try again.');
    }
  }
  getEmptyRows(count: number): any[] {
    return new Array(count).fill(null);
  }
  onPageIndexChange(pageIndex: number) {
    this.pageIndex = pageIndex;
  }
}