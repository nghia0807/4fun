import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { UserDataService, User } from '../../../data/data';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, NzDropDownModule, NzIconModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy {
  user: User = {
    name: '',
    phoneNumber: '',
    email: '',
    address: ''
  };

  private userSubscription: Subscription | undefined;

  constructor(private data: UserDataService) { }

  ngOnInit(): void {
    this.userSubscription = this.data.getUserData().subscribe(userData => {
      if (userData) {
        this.user = {
          name: userData.name || '',
          phoneNumber: userData.phoneNumber || '',
          email: userData.email || '',
          address: userData.address || ''
        };
      } else {
        // Reset user data
      }
    });
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}