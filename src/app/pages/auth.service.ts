import { Injectable } from '@angular/core';
import { LoginComponent } from './login/login.component';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn: boolean = false;
  constructor() { }

  isLoggedIn() {
    return this.loggedIn;
  }

  login() {
      this.loggedIn = true;
  }

  logout() {
    this.loggedIn = false;
  }
}
