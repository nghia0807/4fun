import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DoctorStore } from '../../doctor/doctor.store';
import { System, UserDataService } from '../../../../data/data';
import { TimePickerComponent } from '../../doctor/time-picker/time-picker.component';

interface TimeAndDateSelection {
  time: string;
  date: Date;
}

@Component({
  selector: 'app-welcome-form',
  templateUrl: './welcome-form.component.html',
  styleUrl: './welcome-form.component.css',
  providers: [System, UserDataService, DoctorStore, TimePickerComponent],
})
export class WelcomeFormComponent implements OnInit {
  currentPage = 1;
  pageSize = 18;
  readonly filteredDoctors$ = this.store.filteredDoctors$;
  steps = 0;
  isVisible = false;
  @ViewChild(TimePickerComponent)
  timePickerComponent!: TimePickerComponent;
  form = new UntypedFormGroup({
    selectedType: new UntypedFormControl(null, [Validators.required]),
    comment: new UntypedFormControl(null, [Validators.required, Validators.maxLength(500)]),
    selectedDate: new UntypedFormControl(null, [Validators.required]),
    selectedTime: new UntypedFormControl(null, [Validators.required]) // Added time control
  });
  ngOnInit(): void {
    this.resetForm();
    this.store.setData();
    localStorage.removeItem('selectedDate');
    localStorage.removeItem('selectedTime');
  }
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private store: DoctorStore,
    private timePicker: TimePickerComponent
  ) {
  }

  resetForm(): void {
    this.form.reset();
    this.form.patchValue({
      selectedType: null,
      comment: null,
      selectedDate: null,
      selectedTime: null
    });
    if (this.timePickerComponent) {
      this.timePickerComponent.availableTimes.forEach(time => {
        time.selected = false;
        time.disabled = true;
      });
    }
    this.steps = 0;
  }

  // Handle time and date selection from TimePickerComponent
  onTimeAndDateChange(selection: TimeAndDateSelection | null): void {
    if (selection) {
      this.form.patchValue({
        selectedDate: selection.date,
        selectedTime: selection.time
      });
    } else {
      // Clear the selections when null is received
      this.form.patchValue({
        selectedDate: '',
        selectedTime: ''
      });
    }
  }

  onback(): void {
    if (this.steps > 0) {
      this.steps--;
    }
  }

  oncontinue(): void {
    // Validate current step before continuing
    if (this.isCurrentStepValid()) {
      this.steps++;
      this.store.setFiltersTag(this.form.get('selectedType')?.value);
    } else {
      this.markCurrentStepControlsAsDirty();
    }
  }

  private isCurrentStepValid(): boolean {
    // Add validation logic based on current step
    switch (this.steps) {
      case 0:
        return this.form.get('selectedType')?.valid ?? false;
      case 1:
        return (this.form.get('selectedDate')?.valid ?? false) &&
          (this.form.get('selectedTime')?.valid ?? false);
      case 2:
        return this.form.get('comment')?.valid ?? false;
      default:
        return false;
    }
  }

  private markCurrentStepControlsAsDirty(): void {
    switch (this.steps) {
      case 0:
        this.form.get('selectedType')?.markAsTouched();
        break;
      case 1:
        this.form.get('selectedDate')?.markAsTouched();
        this.form.get('selectedTime')?.markAsTouched();
        break;
      case 2:
        this.form.get('comment')?.markAsTouched();
        break;
    }
  }

  open(): void {
    this.isVisible = true;
    // this.store.setFiltersSearch('');
  }

  close(): void {
    this.isVisible = false;
    this.steps = 0;
    this.resetForm();
    this.timePicker.clearSelections();
  }

  submit(): void {
    if (this.form.valid) {
      const formData = {
        ...this.form.value,
        // dateTime: this.combineDateAndTime(
        //   this.form.value.selectedDate,
        //   this.form.value.selectedTime
        // )
      };

      console.log('Form submitted', formData);
      this.store.setInitialTag(this.form.get('selectedType')?.value);
      this.isVisible = false;
      this.steps = 0;
      this.resetForm();
      this.timePicker.clearSelections();
      // this.router.navigate(['/main/doctor']);
    } else {
      this.markAllControlsAsDirty();
    }
  }

  private markAllControlsAsDirty(): void {
    Object.values(this.form.controls).forEach(control => {
      control.markAsTouched();
      control.updateValueAndValidity({ onlySelf: true });
    });
  }

  private combineDateAndTime(date: Date, timeString: string): Date {
    if (!date || !timeString) return new Date();

    const [hours, minutes] = timeString.split(':').map(Number);
    const combinedDate = new Date(date);
    combinedDate.setHours(hours, minutes, 0, 0);

    return combinedDate;
  }
}