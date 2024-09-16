import { Component, Input } from '@angular/core';
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

  constructor(private modal: NzModalRef) { }

  ngOnInit() {
    this.doctor = this.modal.getConfig().nzData?.doctor;
  }
}