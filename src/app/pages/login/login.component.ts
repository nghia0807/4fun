import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, Router, RouterModule } from '@angular/router';
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
import { System, UserDataService } from '../../../data/data';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { MainStore } from '../main-app.component.store';
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
    NzRadioModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers: [MainStore, System]
})

export class LoginComponent {
  validateForm: FormGroup<{
    userName: FormControl<string>;
    password: FormControl<string>;
    role: FormControl<string>;
  }>;

  constructor(
    private fb: NonNullableFormBuilder,
    private router: Router,
    private authService: AuthService,
    private message: NzMessageService,
    private userDataService: UserDataService,
    private mainStore: MainStore
  ) {
    this.validateForm = this.fb.group({
      userName: ['', [Validators.required]],
      password: ['', [Validators.required]],
      role: ['', [Validators.required]],
    });
  }

  isLogin(): boolean {
    const userName = this.validateForm.get('userName');
    const password = this.validateForm.get('password');
    const role = this.validateForm.get('role');

    return (
      userName?.valid &&
      password?.valid &&
      role?.valid
    ) ?? false;
  }


  onLogin() {
    const userName = this.validateForm.value.userName ?? '';
    const password = this.validateForm.value.password ?? '';
    const role = this.validateForm.value.role ?? '';
    this.mainStore.setRole(role);
    if (this.isLogin()) {
      if (role === 'bs' && !userName.includes('@doctor')) {
        this.message.error('Doctor email must contain @doctor');
        return;
      }

      if (role === 'bn' && userName.includes('@doctor')) {
        this.message.error('Doctor email cannot be used for patient role');
        return;
      }
      login(userName, password)
        .then((result) => {
          if (result.status === "success" && 'email' in result && result.email) {
            this.authService.login();
            this.message.success('Login successfully');
            this.userDataService.refreshUserData(result.email);

            if (role === 'bs') {
              this.mainStore.setRole('bs');
              this.router.navigate(['/main-bs/welcome']);
            } else if (role === 'bn') {
              this.mainStore.setRole('bn');
              this.router.navigate(['/main-bn/welcome']);
            }
          } else {
            this.message.error('Login failed');
          }
        });
    }
  }
}
