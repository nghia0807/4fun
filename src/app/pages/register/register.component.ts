import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ValidationErrors,
  ValidatorFn,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { Observable, Observer } from 'rxjs';
import { NzInputModule } from 'ng-zorro-antd/input';
import { submitRegister } from './registerData';
import { AuthService } from '../auth.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UserDataService } from '../../../data/data';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    NzFormModule,
    RouterOutlet,
    RouterLink,
    NzButtonComponent,
    NzInputModule,
    ReactiveFormsModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  validateForm: FormGroup<{
    name: FormControl<string>;
    email: FormControl<string>;
    password: FormControl<string>;
    confirm: FormControl<string>;
    phonenumber: FormControl<string>;
    address: FormControl<string>;  // New field
  }>;

  submitForm(): void {
    console.log('submit', this.validateForm.value);
  }

  resetForm(e: MouseEvent): void {
    e.preventDefault();
    this.validateForm.reset();
  }

  validateConfirmPassword(): void {
    setTimeout(() => this.validateForm.controls.confirm.updateValueAndValidity());
  }

  userNameAsyncValidator: AsyncValidatorFn = (control: AbstractControl) =>
    new Observable((observer: Observer<ValidationErrors | null>) => {
      setTimeout(() => {
        if (control.value === 'JasonWood') {
          // you have to return `{error: true}` to mark it as an error event
          observer.next({ error: true, duplicated: true });
        } else {
          observer.next(null);
        }
        observer.complete();
      }, 1000);
    });

  confirmValidator: ValidatorFn = (control: AbstractControl) => {
    if (!control.value) {
      return { error: true, required: true };
    } else if (control.value !== this.validateForm.controls.password.value) {
      return { confirm: true, error: true };
    }
    return {};
  };

  constructor(
    private fb: NonNullableFormBuilder,
    private router: Router,
    private authService: AuthService,
    private message: NzMessageService,
    private userDataService: UserDataService // Add this line
  ) {
    this.validateForm = this.fb.group({
      name: ['', [Validators.required]],  // Changed from userName to name
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required]],
      confirm: ['', [this.confirmValidator]],
      phonenumber: ['', [Validators.required]],
      address: ['', [Validators.required]]  // New field
    });
  }

  onRegister() {
    const email = this.validateForm.value.email ?? '';
    const password = this.validateForm.value.password ?? '';
    const phoneNumber = this.validateForm.value.phonenumber ?? '';
    const name = this.validateForm.value.name ?? '';  // New
    const address = this.validateForm.value.address ?? '';  // New

    submitRegister(email, password, phoneNumber, name, address)  // Updated
      .then((result) => {
        if (result.status === "success") {
          this.authService.login();
          this.router.navigate(['main/welcome']);
          this.message.success('Register successfully');
          // Trigger a refresh of user data
          if ('user' in result) {
            this.userDataService.refreshUserData(result.user);
          }
        } else {
          this.message.error('Register failed');
        }
      })
  }
}
