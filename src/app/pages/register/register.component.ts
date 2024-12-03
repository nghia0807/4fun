import { Component, OnInit } from '@angular/core';
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
  ReactiveFormsModule,
  UntypedFormGroup,
  UntypedFormControl
} from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { interval, Observable, Observer, Subscription } from 'rxjs';
import { NzInputModule } from 'ng-zorro-antd/input';
import { submitRegister } from './registerData';
import { AuthService } from '../auth.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UserDataService } from '../../../data/data';
import { EmailVerificationService } from '../../../component/email';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    NzFormModule,
    RouterOutlet,
    RouterLink,
    NzButtonComponent,
    NzInputModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  remainingTime = 30;
  canResendCode = true;
  countdownSubscription: Subscription | null = null;
  verificationCode = '';
  validateForm = new UntypedFormGroup({
    name: new UntypedFormControl(null, [Validators.required]),
    email: new UntypedFormControl(null, [Validators.required]),
    password: new UntypedFormControl(null, [Validators.required]),
    confirm: new UntypedFormControl(null, [Validators.required]),
    phonenumber: new UntypedFormControl(null, [Validators.required]),
    address: new UntypedFormControl(null, [Validators.required]),
    verificationCode: new UntypedFormControl(null, [Validators.required]),
  });
  
  ngOnInit(): void {
      this.validateForm.get('verificationCode')?.setValidators(this.validationCode(this.validateForm));
  }
  
  resetForm(e: MouseEvent): void {
    e.preventDefault();
    this.validateForm.reset();
  }

  validateConfirmPassword(): void {
    setTimeout(() => this.validateForm.get('password')?.updateValueAndValidity());
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
    } else if (control.value !== this.validateForm.get('password')?.value) {
      return { confirm: true, error: true };
    }
    return {};
  };

  constructor(
    private fb: NonNullableFormBuilder,
    private router: Router,
    private authService: AuthService,
    private message: NzMessageService,
    private userDataService: UserDataService, // Add this line
    private emailVerificationService: EmailVerificationService
  ) {
  }
  send() {
    this.verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const email = this.validateForm.value.email ?? '';
    this.emailVerificationService.sendVerificationEmail(email, this.verificationCode)
      .then(() => {
        this.message.success('Verification code sent to your email');
        this.startCountdown();
      })
      .catch((error) => {
        this.message.error('Failed to send verification code');
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
          this.router.navigate(['main-bn/welcome']);
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

  startCountdown() {
    // Reset countdown parameters
    this.remainingTime = 30;
    this.canResendCode = false;

    // Cancel any existing countdown
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
    }

    // Create a new countdown
    this.countdownSubscription = interval(1000).subscribe(() => {
      this.remainingTime--;

      // When countdown reaches zero
      if (this.remainingTime <= 0) {
        this.canResendCode = true;

        // Stop the countdown
        if (this.countdownSubscription) {
          this.countdownSubscription.unsubscribe();
        }
      }
    });
  }

  validationCode(form: any): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!form.get('email')?.value) {
        return null;
      }
      if (form.get('email')?.value && !value) return { required: true };
      if (form.get('email')?.value && value != this.verificationCode) {
        return { invalid: true };
      }
      return null;
    }
  }
}
