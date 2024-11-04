import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DoctorComponent } from '../../doctor/doctor.component';
import { DoctorStore } from '../../doctor/doctor.store';
import { System, UserDataService } from '../../../../data/data';
import { FilterDoctorComponent } from '../../doctor/filter-doctor/filter-doctor.component';
@Component({
  selector: 'app-welcome-form',
  templateUrl: './welcome-form.component.html',
  styleUrl: './welcome-form.component.css',
  providers: [ System, UserDataService, DoctorStore],
})
export class WelcomeFormComponent {
  form: FormGroup;
  isVisible = false;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private store: DoctorStore
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
      this.store.setInitialTag(this.form.get('selectedType')?.value);
      console.log(this.form.get('comment')?.value);
      this.router.navigate(['/main/doctor']);
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