import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn: boolean = false;
  constructor() { }

  isLoggedIn() {
    return this.loggedIn;
  }

  login(userName: string, password: string) {
    //check username and password ở đây
    if (userName == 'tam' && password == '123') {
      this.loggedIn = true;
    }
  }

  logout() {
    this.loggedIn = false;
  }
}
