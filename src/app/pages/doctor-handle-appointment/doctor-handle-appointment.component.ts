// doctor-handle-appointment.component.ts
import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AppointmentStatus, ListOfAppointmentStatus } from '../../../component/enum';
import { DoctorHandleStore } from './doctor-handle.store';

interface Appointment {
  id: number;
  patientName: string;
  time: string;
  comment: string;
  status: AppointmentStatus;
  appointmentDate: string;
}

@Component({
  selector: 'app-doctor-handle-appointment',
  templateUrl: './doctor-handle-appointment.component.html',
  styleUrls: ['./doctor-handle-appointment.component.css'],
  providers: [DoctorHandleStore]
})
export class DoctorHandleAppointmentComponent implements OnInit {
  // Mock appointments data
  appointments: Appointment[] = [
    {
      id: 1,
      patientName: 'Nguyễn Văn A',
      time: '10:00 AM',
      comment: 'Đau đầu và sốt nhẹ',
      status: AppointmentStatus.CANCEL,
      appointmentDate: '2024-02-15'
    },
    {
      id: 2,
      patientName: 'Trần Thị B',
      time: '11:30 AM',
      comment: 'Kiểm tra sức khỏe định kỳ',
      status: AppointmentStatus.READY,
      appointmentDate: '2024-02-15'
    },
    {
      id: 3,
      patientName: 'Lê Minh C',
      time: '1:00 PM',
      comment: 'Khám tim mạch',
      status: AppointmentStatus.MEETING,
      appointmentDate: '2024-02-15'
    },
    {
      id: 4,
      patientName: 'Phạm Quang D',
      time: '2:30 PM',
      comment: 'Điều trị viêm khớp',
      status: AppointmentStatus.ENDING,
      appointmentDate: '2024-02-15'
    },
    {
      id: 5,
      patientName: 'Ngô Thị E',
      time: '9:00 AM',
      comment: 'Kiểm tra sức khỏe tổng quát',
      status: AppointmentStatus.READY,
      appointmentDate: '2024-02-16'
    },
    {
      id: 6,
      patientName: 'Bùi Đức F',
      time: '3:00 PM',
      comment: 'Khám da liễu',
      status: AppointmentStatus.CANCEL,
      appointmentDate: '2024-02-16'
    },
    {
      id: 7,
      patientName: 'Hoàng Thị G',
      time: '4:30 PM',
      comment: 'Khám phụ khoa',
      status: AppointmentStatus.MEETING,
      appointmentDate: '2024-02-16'
    },
    {
      id: 8,
      patientName: 'Vũ Minh H',
      time: '8:30 AM',
      comment: 'Chăm sóc răng miệng',
      status: AppointmentStatus.READY,
      appointmentDate: '2024-02-17'
    },
    {
      id: 9,
      patientName: 'Trần Thanh I',
      time: '12:00 PM',
      comment: 'Xét nghiệm máu định kỳ',
      status: AppointmentStatus.ENDING,
      appointmentDate: '2024-02-17'
    },
    {
      id: 10,
      patientName: 'Đặng Hữu J',
      time: '5:00 PM',
      comment: 'Thăm khám mắt',
      status: AppointmentStatus.MEETING,
      appointmentDate: '2024-02-17'
    }
  ];

  constructor(
    private store: DoctorHandleStore
  ) { }

  ngOnInit() {

  }

  getStatusConfig(status: AppointmentStatus) {
    return ListOfAppointmentStatus.find(item => item.value === status);
  }

  getEmptyRows(count: number): any[] {
    return new Array(count).fill(null);
  }

  openMeeting() {
    this.store.setIsMeeting(true); 
    //CÁCH GÁN GIÁ TRỊ
    this.store.setMeetingValue({
      id: 0,
      patientName: 'test',
      address: 'test',
      birth: new Date(),
      comment: 'test',
      appointmentDate: new Date()
    })
  }
}