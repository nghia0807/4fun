import { Component } from '@angular/core';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzInputModule } from 'ng-zorro-antd/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { Router } from '@angular/router';
import { FilterDoctorComponent } from '../../doctor/filter-doctor/filter-doctor.component';
@Component({
  selector: 'app-welcome-form',
  standalone: true,
  imports: [
    NzDrawerModule, 
    NzSelectModule,
    FormsModule,
    NzInputModule,
    NzFormModule,
    ReactiveFormsModule
  ],
  templateUrl: './welcome-form.component.html',
  styleUrl: './welcome-form.component.css'
})
export class WelcomeFormComponent {
  form: FormGroup;
  isVisible = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    // private filter: FilterDoctorComponent
  ) {
    this.form = this.fb.group({
      selectedType: ['', Validators.required],
      comment: ['', [Validators.required, Validators.maxLength(500)]]
    });
  }

  open(): void {
    this.isVisible = true;
  }

  close(): void {
    this.isVisible = false;
  }

  submit(): void {
    if (this.form.valid) {
      console.log('Form submitted', this.form.value);
      this.isVisible = false;
      this.router.navigate(['/main/doctor']);
      // this.filter.setFilter(this.form.value.selectedType);
    } else {
      Object.values(this.form.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
}