import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { Doctor, System, UserDataService } from '../../../../data/data';
import { TimePickerComponent } from '../time-picker/time-picker.component';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { DoctorStore } from '../doctor.store';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzTextareaCountComponent } from 'ng-zorro-antd/input';
import { Subscription } from 'rxjs';
import { catchError, concatMap, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';

interface TimeAndDateSelection {
  time: string;
  date: Date;
}

@Component({
  selector: 'app-doctor-modal',
  standalone: true,
  imports: [
    CommonModule,
    NzDrawerModule,
    NzGridModule,
    NzFormModule,
    FormsModule,
    ReactiveFormsModule,
    NzButtonModule,
    NzInputModule,
    TimePickerComponent,
    NzTextareaCountComponent,
    NzLayoutModule
  ],
  templateUrl: './doctor-modal.component.html',
  styleUrl: './doctor-modal.component.css',
  providers: [DoctorStore, System, UserDataService, TimePickerComponent]
})
export class DoctorModalComponent implements OnInit, OnDestroy {
  readonly visible$ = this.store.is_modal$;
  readonly form_value$ = this.store.modal_value$;
  private destroy$ = new Subject<void>();
  private valueSubscription?: Subscription;
  doctor: string = '';
  @ViewChild(TimePickerComponent) timePickerComponent!: TimePickerComponent;

  form = new UntypedFormGroup({
    comment: new UntypedFormControl(null, [Validators.required, Validators.maxLength(500)]),
    selectedDate: new UntypedFormControl(null, [Validators.required]),
    selectedTime: new UntypedFormControl(null, [Validators.required])
  });

  constructor(
    private store: DoctorStore,
    private timePicker: TimePickerComponent,// Inject TimePickerComponent
    private message: NzMessageService,
    private userDataService: UserDataService,
  ) { }

  ngOnInit() {
    localStorage.removeItem('selectedDate');
    localStorage.removeItem('selectedTime');

    // Modified subscription to prevent infinite loops
    this.valueSubscription = this.form_value$
      .pipe(takeUntil(this.destroy$))
      .subscribe((x) => {
        if(x.name){
          this.doctor = x.name;
        }
        else {
          this.doctor = '';
        }
        this.resetForm();
      });

    // Initialize form with default values
    this.resetForm();
  }

  ngOnDestroy() {
    this.form.patchValue({
      name: ''
    })
    this.destroy$.next();
    this.destroy$.complete();
  }

  onTimeAndDateSelected(selection: TimeAndDateSelection | null) {
    if (selection) {
      // Use Object.assign to create a new object and prevent circular references
      const formValue = {
        selectedDate: new Date(selection.date),
        selectedTime: selection.time
      };

      this.form.patchValue(formValue, {
        emitEvent: false,
        onlySelf: true
      });
    } else {
      this.form.patchValue({
        selectedDate: null,
        selectedTime: null,
      }, {
        emitEvent: false,
        onlySelf: true
      });
    }
  }

  onClose() {
    this.resetForm();
    this.store.setIsModal(false);
  }

  submitAppointment() {
    if (this.form.valid) {
      const formData = {
        ...this.form.value,
        selectedDate: this.form.get('selectedDate')?.value,
        selectedTime: this.form.get('selectedTime')?.value,
        comment: this.form.get('comment')?.value
      };
      console.log(formData, this.doctor);
      this.message
        .loading('Action in progress', { nzDuration: 2500 })
        .onClose!.pipe(
          concatMap(() => {
            const uid = this.userDataService.getCurrentUserUid();
            if (formData.selectedDate) {
              return this.userDataService.createAppointment(uid, this.doctor, formData.selectedTime, formData.selectedDate, formData.comment);
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
      this.onClose();
    } else {
      Object.keys(this.form.controls).forEach(key => {
        const control = this.form.get(key);
        if (control) {
          control.markAsTouched();
        }
      });
    }
  }

  resetForm(): void {
    // Suspend form value emission during reset
    this.form.reset(undefined, {
      emitEvent: false,
      onlySelf: true
    });

    // Set default values without emitting events
    this.form.patchValue({
      comment: null,
      selectedDate: null,
      selectedTime: null
    }, {
      emitEvent: false,
      onlySelf: true
    });

    // Reset TimePicker using the injected service
    this.timePicker.clearSelections();

    // Mark form as pristine and untouched
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }
}