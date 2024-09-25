import { Component, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input'; // Example if using input fields
import { NzModalRef } from 'ng-zorro-antd/modal';
import { Doctor } from '../../../../data/data';
import { TimePickerComponent } from '../time-picker/time-picker.component';

@Component({
  selector: 'app-doctor-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzButtonModule,
    NzInputModule,
    TimePickerComponent
  ],
  templateUrl: './doctor-modal.component.html',
  styleUrl: './doctor-modal.component.css'
})
export class DoctorModalComponent {
  doctor!: Doctor;
  onTimeAndDateSelected!: (event: { time: string, date: Date }) => void;

  @ViewChild(TimePickerComponent) timePickerComponent!: TimePickerComponent;

  constructor(private modal: NzModalRef) { }

  ngOnInit() {
    const config = this.modal.getConfig().nzData;
    this.doctor = config?.doctor;
    this.onTimeAndDateSelected = config?.onTimeAndDateSelected;
  }

  onTimeAndDateChange(event: { time: string, date: Date }) {
    if (this.onTimeAndDateSelected) {
      this.onTimeAndDateSelected(event);
    }
  }
}