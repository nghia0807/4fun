import { Component, OnInit } from '@angular/core';
import { AppointmentStatus } from '../../../component/enum';
import { AppointmentStatusData, DoctorDataService } from '../../../data/doctor.service';

@Component({
  selector: 'app-doctor-welcome',
  templateUrl: './doctor-welcome.component.html',
  styleUrl: './doctor-welcome.component.css'
})
export class DoctorWelcomeComponent implements OnInit {
  selectedMonth: Date = new Date();
  monthFormat = 'yyyy/MM';
  
  // Change to use an array instead of a Promise
  appointmentStatusData: AppointmentStatusData[] = [];

  constructor(
    private service: DoctorDataService
  ) {}

  ngOnInit() {
    this.selectedMonth = new Date();
    this.loadAppointmentStatusData();
  }

  async loadAppointmentStatusData() {
    try {
      this.appointmentStatusData = await this.service.getAppointmentStatusCount(undefined, this.selectedMonth);
    } catch (error) {
      console.error('Error loading appointment status data:', error);
      this.appointmentStatusData = [];
    }
  }

  onMonthChange(date: Date) {
    this.selectedMonth = date;
    this.loadAppointmentStatusData();
  }

  get listData(): AppointmentStatusData[] {
    return this.appointmentStatusData.filter(item => {
      return true;
    });
  }
}