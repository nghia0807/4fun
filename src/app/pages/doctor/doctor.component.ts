import { Component, OnInit, ViewChild } from '@angular/core';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { CommonModule } from '@angular/common';
import { NzModalModule, NzModalService, NzModalRef } from 'ng-zorro-antd/modal';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { DoctorModalComponent } from './doctor-modal/doctor-modal.component';
import { Doctor, System } from '../../../data/data';
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';
import { concatMap, catchError, take, takeUntil } from 'rxjs/operators';
import { of, Subject } from 'rxjs';
import { FilterDoctorComponent } from './filter-doctor/filter-doctor.component';
import { UserDataService } from '../../../data/data'; // Import UserDataService
import { TimePickerComponent } from './time-picker/time-picker.component';
import { DoctorStore } from './doctor.store';
import { map } from 'rxjs/operators';
import { WelcomeComponent } from '../welcome/welcome.component';
import { WelcomeFormComponent } from '../welcome/welcome-form/welcome-form.component';
@Component({
  selector: 'app-doctor',
  standalone: true,
  imports: [
    CommonModule,
    NzGridModule,
    NzCardModule,
    NzIconModule,
    NzPaginationModule,
    NzModalModule,
    NzButtonModule,
    DoctorModalComponent,
    NzMessageModule,
    FilterDoctorComponent,
    TimePickerComponent
  ],
  templateUrl: './doctor.component.html',
  styleUrl: './doctor.component.css',
  providers: [System, UserDataService, DoctorStore]
})
export class DoctorComponent implements OnInit {
  readonly search_data$ = this.store.search_data$;
  readonly total_doctors$ = this.store.total_doctors$;
  readonly filteredDoctors$ = this.store.filteredDoctors$;
  initial_tag: string = '';
  currentPage = 1;
  selectedTime: string = '';
  selectedDate: Date | null = null;
  @ViewChild(TimePickerComponent) timePickerComponent!: TimePickerComponent;

  constructor(
    private modalService: NzModalService,
    private message: NzMessageService,
    private userDataService: UserDataService,
    private store: DoctorStore,
  ) {
  }

  ngOnInit() {
    this.store.setData();
    this.store.initial_tag$.subscribe((x) => {
      this.initial_tag = x;
    })
  }

  pageChanged(page: number) {
    this.currentPage = page;
  }

  showRegistrationModal(doctor: Doctor): void {
    const modal: NzModalRef = this.modalService.create({
      nzTitle: `You are registering with Dr.${doctor.name}`,
      nzContent: DoctorModalComponent,
      nzData: {
        doctor: doctor,
        onTimeAndDateSelected: this.onTimeAndDateSelected.bind(this)
      },
      nzFooter: [
        {
          label: 'Hủy',
          onClick: () => modal.close()
        },
        {
          label: 'Đăng ký',
          type: 'primary',
          onClick: () => {
            if (!this.selectedTime || !this.selectedDate) {
              this.message.error('Please select a time and date for the appointment');
              return;
            }
            this.message
              .loading('Action in progress', { nzDuration: 2500 })
              .onClose!.pipe(
                concatMap(() => {
                  const uid = this.userDataService.getCurrentUserUid();
                  // Only proceed if selectedDate is not null
                  if (this.selectedDate) {
                    return this.userDataService.createAppointment(uid, doctor.name, this.selectedTime, this.selectedDate);
                  } else {
                    throw new Error('Selected date is null');
                  }
                }),
                concatMap((appointmentId) => {
                  console.log('Appointment created with ID:', appointmentId);
                  return this.message.success('Appointment registered successfully', { nzDuration: 2500 }).onClose!;
                }),
                catchError((error) => {
                  console.error('Error creating appointment:', error);
                  return this.message.error('Failed to register appointment', { nzDuration: 2500 }).onClose!;
                })
              )
              .subscribe(() => {
                console.log('Registration process completed');
              });
            modal.close();
          }
        }
      ]
    });
  }

  onTimeAndDateSelected(event: { time: string, date: Date }) {
    this.selectedTime = event.time;
    this.selectedDate = event.date;
    console.log('Time and date selected:', this.selectedTime, this.selectedDate);
  }
}