import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { UserDataService, AppointmentData } from '../../../../data/data';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { AppointmentStatus, ListOfAppointmentStatus } from '../../../../component/enum';
@Component({
  selector: 'app-history-list',
  standalone: true,
  imports: [
    CommonModule,
    NzTableModule,
    NzTagModule
  ],
  templateUrl: './history-list.component.html',
  styleUrl: './history-list.component.css'
})
export class HistoryListComponent implements OnInit {
  appointments: AppointmentData[] = [];

  constructor(private userDataService: UserDataService) {}

  async ngOnInit() {
    await this.loadHistoryAppointments();
  }

  async loadHistoryAppointments() {
    this.appointments = await this.userDataService.getUserAppointments(null);//where is the ID?
  }
  getStatusConfig(status: AppointmentStatus) {
    return ListOfAppointmentStatus.find(item => item.value === status);
  }
}
