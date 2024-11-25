import { Component, OnInit } from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';
import { UserDataService, Appointment } from '../../../../data/data';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [NzTableModule, NzPopconfirmModule],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  appointments: Appointment[] = [];

  constructor(private userDataService: UserDataService) {}

  async ngOnInit() {
    await this.loadAppointments();
  }

  async loadAppointments() {
    this.appointments = await this.userDataService.getAppointments(false);
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