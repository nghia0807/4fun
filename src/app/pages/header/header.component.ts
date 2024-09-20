import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { UserDataService, User } from '../../../data/data';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, NzDropDownModule, NzIconModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  user: User = {
    name: '',
    phone: '',
    email: '',
    address: ''
  };

  constructor(private data: UserDataService) { }

  ngOnInit(): void {
    this.updateUserData();
  }

  private async updateUserData() {
    this.user = {
      name: this.data.getName(),
      phone: this.data.getPhoneNumber(),
      email: this.data.getEmail(),
      address: this.data.getAddress()
    };
  }
}