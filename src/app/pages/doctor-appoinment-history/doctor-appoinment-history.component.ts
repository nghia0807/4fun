import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppointmentStatus, ListOfAppointmentStatus } from '../../../component/enum';
import { DoctorAppointmentHistoryStore } from './doctor-appointment-history.store';
import { DoctorAppointment } from '../../../data/data';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-doctor-appoinment-history',
  templateUrl: './doctor-appoinment-history.component.html',
  styleUrl: './doctor-appoinment-history.component.css',
  providers: [DoctorAppointmentHistoryStore]
})
export class DoctorAppoinmentHistoryComponent implements OnInit, OnDestroy {
  appointments: DoctorAppointment[] = [];
  selectedMonth: Date = new Date();
  monthFormat = 'yyyy/MM';
  private appointmentSubscription: Subscription = new Subscription();
  ngOnInit() {
    this.appointmentSubscription = this.store.appointments$.subscribe(appointments => {
      this.appointments = this.sortAppointments(appointments || []);
      this.total = Math.ceil(this.appointments.length / this.pageSize);
    });
  }
  ngOnDestroy(): void {
    if (this.appointmentSubscription) {
      this.appointmentSubscription.unsubscribe();
    }
  }
  formatDate(dateString: Date): string {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  pageSize = 7; // Số items trên mỗi trang
  total = Math.ceil(this.appointments.length / this.pageSize); // Correct total pages calculation
  pageIndex = 1; // Trang hiện tại

  onPageIndexChange(pageIndex: number) {
    this.pageIndex = pageIndex;
  }

  get paginatedAppointments(): DoctorAppointment[] {
    // Ensure appointments is defined and is an array
    if (!this.appointments || !Array.isArray(this.appointments)) {
      return []; // Return an empty array if appointments is undefined or not an array
    }

    // Recalculate total pages based on current appointments
    this.total = Math.ceil(this.appointments.length / this.pageSize);

    // Calculate start and end indices for pagination
    const startIndex = (this.pageIndex - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;

    // Return sliced appointments, handling cases where endIndex might exceed array length
    return this.appointments.slice(startIndex, Math.min(endIndex, this.appointments.length));
  }

  sortAppointments(appointments: DoctorAppointment[]): DoctorAppointment[] {
    return [...appointments].sort((a, b) => {
      // First, compare by date
      const dateComparison = this.compareDate(a.date, b.date);
      if (dateComparison === 0) {
        return this.compareTime(a.time, b.time);
      }

      return dateComparison;
    });
  }

  // Helper method to compare dates
  compareDate(dateA: Date, dateB: Date): number {
    return new Date(dateA).getTime() - new Date(dateB).getTime();
  }

  // Helper method to compare times in 24-hour format
  compareTime(timeA: string, timeB: string): number {
    // Split time into hours and minutes
    const parseTime = (time: string) => {
      const [hours, minutes] = time.split(':').map(part => parseInt(part, 10));
      return hours * 60 + (minutes || 0);
    };

    return parseTime(timeA) - parseTime(timeB);
  }

  // Filter and paginate appointments


  constructor(
    private store: DoctorAppointmentHistoryStore
  ) {
    this.store.appointments$.subscribe(s => this.appointments = s)
  }



  getStatusConfig(status: AppointmentStatus) {
    return ListOfAppointmentStatus.find(item => item.value === status);
  }

  getEmptyRows(count: number): any[] {
    return new Array(count).fill(null);
  }


  // In your component
  onDateFilter(value: Date) {
    // Create a new Date object to ensure a clean reference
    const filterDate = new Date(value);
    this.store.setFilter(filterDate);
  }
}
