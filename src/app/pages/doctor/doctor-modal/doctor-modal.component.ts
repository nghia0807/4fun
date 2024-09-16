import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input'; // Example if using input fields

interface Doctor {
  name: string;
  specialization: string;
  imageUrl: string;
}

@Component({
  selector: 'app-doctor-modal',
  standalone: true,
  imports: [ 
    CommonModule,
    FormsModule,
    NzButtonModule,
    NzInputModule
  ],
  templateUrl: './doctor-modal.component.html',
  styleUrl: './doctor-modal.component.css'
})
export class DoctorModalComponent {
  @Input() doctor!: Doctor;
}
