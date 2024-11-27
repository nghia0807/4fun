import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { UserDataService, Appointment } from '../../../../data/data';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { MainStore } from '../../main-app.component.store';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { AppointmentStatus, ListOfAppointmentStatus } from '../../../../component/enum';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [NzTableModule, NzPopconfirmModule, CommonModule, NzTagModule],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
  providers: [MainStore]
})
export class ListComponent implements OnInit {
  appointments: Appointment[] = [];
  readonly blured$ = this.mainStore.bluredSlider$;
  constructor(
    private userDataService: UserDataService,
    private mainStore: MainStore
  ) { }

  async ngOnInit() {
    await this.loadAppointments();
  }

  async loadAppointments() {
    this.appointments = await this.userDataService.getAppointments(false);
  }

  getStatusConfig(status: AppointmentStatus) {
    return ListOfAppointmentStatus.find(item => item.value === status);
  }

  async cancelAppointment(appointmentKey: string) {
    try {
      await this.userDataService.cancelAppointment(appointmentKey);
      await this.loadAppointments();
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      // Handle error (e.g., show an error message to the user)
    }
  }
}