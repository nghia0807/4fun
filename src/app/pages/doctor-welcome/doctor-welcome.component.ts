import { Component, OnInit } from '@angular/core';
import { AppointmentStatus } from '../../../component/enum';

@Component({
  selector: 'app-doctor-welcome',
  templateUrl: './doctor-welcome.component.html',
  styleUrl: './doctor-welcome.component.css'
})
export class DoctorWelcomeComponent implements OnInit {
  selectedMonth: Date = new Date();
  monthFormat = 'yyyy/MM';
  
  appointmentStatusData = [
    { status: AppointmentStatus.CANCEL, count: 10 },
    { status: AppointmentStatus.MEETING, count: 15 },
    { status: AppointmentStatus.READY, count: 20 },
    { status: AppointmentStatus.ENDING, count: 5 }
  ];

  ngOnInit() {
    this.selectedMonth = new Date();
  }

  onMonthChange(date: Date) {
    this.selectedMonth = date;
  }

  get listData() {
    //xử lí selectedMonth lọc để lấy dữ liệu 
    return this.appointmentStatusData;
  }
}