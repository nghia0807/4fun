import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { UserDataService, User } from '../../../data/data';
import { Subscription } from 'rxjs';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { PurchaseDrawerComponent } from './purchase-drawer/purchase-drawer.component';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, NzDropDownModule, NzIconModule, NzToolTipModule,
    NzButtonComponent,
    PurchaseDrawerComponent
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  providers: [PurchaseDrawerComponent]
})
export class HeaderComponent implements OnInit, OnDestroy {
  @ViewChild(PurchaseDrawerComponent) drawerComponent!: PurchaseDrawerComponent;
  user: User = {
    name: '',
    phoneNumber: '',
    email: '',
    address: '',
    turn: 0,
  };

  private userSubscription: Subscription | undefined;

  constructor(
    private data: UserDataService,
    private purchase: PurchaseDrawerComponent
  ) { }

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

  openDrawer() {
    this.drawerComponent.open();
  }
}