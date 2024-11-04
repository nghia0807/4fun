import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, Router, RouterModule, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzMessageComponent, NzMessageService } from 'ng-zorro-antd/message';
import { AuthService } from '../auth.service';
import { login } from './loginData'
import { UserDataService } from '../../../data/data';
import { NzRadioModule } from 'ng-zorro-antd/radio';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterOutlet,
    NzFormModule,
    ReactiveFormsModule,
    NzInputModule,
    NzButtonModule,
    NzIconModule,
    NzCheckboxModule,
    NzNotificationModule,
    RouterLink,
    NzMessageComponent,
    RouterModule,
    NzRadioModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {
  validateForm: FormGroup<{
    userName: FormControl<string>;
    password: FormControl<string>;
    remember: FormControl<boolean>;
  }>;

  constructor(
    private fb: NonNullableFormBuilder,
    private router: Router,
    private authService: AuthService,
    private message: NzMessageService,
    private userDataService: UserDataService // Add this line
  ) {
    this.validateForm = this.fb.group({
      userName: ['', [Validators.required]],
      password: ['', [Validators.required]],
      remember: [true]
    });
  }

  roleSelect(role : string) {
    return role;
  }

  submitForm(): void {
    if (this.validateForm.valid) {
      const { userName, password } = this.validateForm.value;
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  onLogin() {
    const userName = this.validateForm.value.userName ?? '';
    const password = this.validateForm.value.password ?? '';
    login(userName, password)
      .then((result) => {
        if (result.status === "success" && 'user' in result) {
          this.authService.login();
          this.router.navigate(['/main/welcome']);
          this.message.success('Login successfully');
          // Trigger a refresh of user data
          this.userDataService.refreshUserData(result.user.uid);
        } else {
          this.message.error('Login failed');
        }
      });
  }
}