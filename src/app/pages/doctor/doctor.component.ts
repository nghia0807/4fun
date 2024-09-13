import { Component } from '@angular/core';
import { NzFlexModule } from 'ng-zorro-antd/flex';

@Component({
  selector: 'app-doctor',
  standalone: true,
  imports: [
    NzFlexModule
  ],
  templateUrl: './doctor.component.html',
  styleUrl: './doctor.component.css'
})
export class DoctorComponent {
  items = ['Item 1', 'Item 2', 'Item 3', 'Item 4'];
}
