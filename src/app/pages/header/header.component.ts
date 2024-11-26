import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { UserDataService, User } from '../../../data/data';
import { Subscription } from 'rxjs';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, NzDropDownModule, NzIconModule, NzToolTipModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy {
  user: User = {
    name: '',
    phoneNumber: '',
    email: '',
    address: '',
    turn: 0,
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
          address: userData.address || '',
          turn: userData.turn || 0,
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