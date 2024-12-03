import { Component } from '@angular/core';
import { AppointmentStatus, ListOfAppointmentStatus } from '../../../component/enum';
interface Appointment {
  id: number;
  patientName: string;
  time: string;
  comment: string;
  status: AppointmentStatus;
  appointmentDate: Date;
}
@Component({
  selector: 'app-doctor-appoinment-history',
  templateUrl: './doctor-appoinment-history.component.html',
  styleUrl: './doctor-appoinment-history.component.css'
})
export class DoctorAppoinmentHistoryComponent {
  appointments: Appointment[] = [
    {
      id: 1,
      patientName: 'Nguyễn Văn A',
      time: '10:00',
      comment: 'Đau đầu và sốt nhẹ',
      status: AppointmentStatus.CANCEL,
      appointmentDate: new Date('2024-11-26T04:12:59.200Z')
    },
    {
      id: 2,
      patientName: 'Trần Thị B',
      time: '11:30',
      comment: 'Kiểm tra sức khỏe định kỳ',
      status: AppointmentStatus.READY,
      appointmentDate: new Date('2024-12-26T04:12:59.200Z')
    },
    {
      id: 3,
      patientName: 'Lê Minh C',
      time: '1:00',
      comment: 'Khám tim mạch',
      status: AppointmentStatus.MEETING,
      appointmentDate: new Date('2024-12-01T04:12:59.200Z')
    },
    {
      id: 4,
      patientName: 'Phạm Quang D',
      time: '2:30',
      comment: 'Điều trị viêm khớp',
      status: AppointmentStatus.ENDING,
      appointmentDate: new Date('2024-12-04T04:12:59.200Z')
    },
    {
      id: 5,
      patientName: 'Ngô Thị E',
      time: '9:00',
      comment: 'Kiểm tra sức khỏe tổng quát',
      status: AppointmentStatus.READY,
      appointmentDate: new Date('2024-12-03T04:12:59.200Z')
    },
    {
      id: 6,
      patientName: 'Bùi Đức F',
      time: '3:00',
      comment: 'Khám da liễu',
      status: AppointmentStatus.CANCEL,
      appointmentDate: new Date('2024-12-02T04:12:59.200Z')
    },
    {
      id: 7,
      patientName: 'Hoàng Thị G',
      time: '4:30',
      comment: 'Khám phụ khoa',
      status: AppointmentStatus.MEETING,
      appointmentDate: new Date('2024-12-10T04:12:59.200Z')
    },
    {
      id: 8,
      patientName: 'Vũ Minh H',
      time: '8:30',
      comment: 'Chăm sóc răng miệng',
      status: AppointmentStatus.READY,
      appointmentDate: new Date('2024-12-11T04:12:59.200Z')
    },
    {
      id: 9,
      patientName: 'Trần Thanh I',
      time: '12:00',
      comment: 'Xét nghiệm máu định kỳ',
      status: AppointmentStatus.ENDING,
      appointmentDate: new Date('2024-12-21T04:12:59.200Z')
    },
    {
      id: 10,
      patientName: 'Đặng Hữu J',
      time: '5:00 PM',
      comment: 'Thăm khám mắt',
      status: AppointmentStatus.MEETING,
      appointmentDate: new Date('2024-12-12T04:12:59.200Z')
    },
    {
      id: 11,
      patientName: 'Đặng Hữu J',
      time: '5:00',
      comment: 'Thăm khám mắt',
      status: AppointmentStatus.MEETING,
      appointmentDate: new Date('2024-12-11T04:12:59.200Z')
    }
  ];
  selectedMonth: Date = new Date();
  monthFormat = 'yyyy/MM';

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

  get paginatedAppointments(): Appointment[] {
    this.sortAppointments();
    const startIndex = (this.pageIndex - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    //xử lí lọc theo selectedMonth
    console.log(this.selectedMonth);
    return this.appointments.slice(startIndex, endIndex);
  }

  sortAppointments() {
    this.appointments.sort((a, b) => {
      // First, compare by date
      const dateComparison = this.compareDate(a.appointmentDate, b.appointmentDate);
      
      // If dates are the same, compare by time
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

  ) { }

  ngOnInit() {

  }

  getStatusConfig(status: AppointmentStatus) {
    return ListOfAppointmentStatus.find(item => item.value === status);
  }

  getEmptyRows(count: number): any[] {
    return new Array(count).fill(null);
  }

}
