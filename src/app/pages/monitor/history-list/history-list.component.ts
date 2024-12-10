import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { UserDataService, Appointment } from '../../../../data/data';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { AppointmentStatus, ListOfAppointmentStatus } from '../../../../component/enum';
import { TableComponentComponent } from '../../../../component/table-component/table-component.component';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
@Component({
  selector: 'app-history-list',
  standalone: true,
  imports: [
    CommonModule,
    NzTableModule,
    NzTagModule,
    TableComponentComponent,
    NzPaginationModule
  ],
  templateUrl: './history-list.component.html',
  styleUrl: './history-list.component.css'
})
export class HistoryListComponent implements OnInit {
  appointments: Appointment[] = [];
  pageSize = 5; // Số items trên mỗi trang
  total = 0;
  pageIndex = 1; // Trang hiện tại
  updateTotal() {
    this.total = this.appointments.length;
  }
  get paginatedAppointments(): Appointment[] {
    const startIndex = (this.pageIndex - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.appointments.slice(startIndex, endIndex);
  }

  constructor(private userDataService: UserDataService) {}

  async ngOnInit() {
    await this.loadHistoryAppointments();
    this.updateTotal();
  }

  async loadHistoryAppointments() {
    this.appointments = await this.userDataService.getAppointmentsHistory();
    this.updateTotal();
  }

  getStatusConfig(status: AppointmentStatus) {
    return ListOfAppointmentStatus.find(item => item.value === status);
  }
  getEmptyRows(count: number): any[] {
    return new Array(count).fill(null);
  }
  onPageIndexChange(pageIndex: number) {
    this.pageIndex = pageIndex;
  }
}
