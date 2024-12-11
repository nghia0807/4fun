import { Component } from '@angular/core';
import { NzDrawerComponent } from 'ng-zorro-antd/drawer';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { CommonModule } from '@angular/common';
import { NzQRCodeModule } from 'ng-zorro-antd/qr-code';
import { NzMessageComponent, NzMessageService } from 'ng-zorro-antd/message';
import { UserDataService } from '../../../../data/data';
import { HeaderComponent } from '../header.component';
import { MainStore } from '../../main-app.component.store';

@Component({
  selector: 'app-purchase-drawer',
  standalone: true,
  imports: [
    NzDrawerComponent,
    NzButtonComponent,
    CommonModule,
    NzQRCodeModule,
    NzMessageComponent
  ],
  templateUrl: './purchase-drawer.component.html',
  styleUrl: './purchase-drawer.component.css'
})
export class PurchaseDrawerComponent {
  visible = false;
  selectedOption: any = null;
  isSubmitting = false;

  paymentOptions = [
    {
      label: '1 Turn',
      amount: -100000,
      qrCode: 'https://www.youtube.com/watch?v=9mL4iZ5pfo8',
      turns: 1
    },
    {
      label: '2 Turn',
      amount: -200000,
      qrCode: 'https://puu.sh/hZch4/d39e8b4ef4.jpg',
      turns: 3
    },
    {
      label: '3 Turn',
      amount: -300000,
      qrCode: 'www.imgur.com/a/G6rU8',
      turns: 3
    },
    {
      label: '4 Turn',
      amount: -400000,
      qrCode: 'https://tinyurl.com/5x2bcwjy',
      turns: 4
    },
    {
      label: '5 Turn',
      amount: -500000,
      qrCode: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      turns: 5
    }
  ];

  constructor(
    private message: NzMessageService,
    private userService: UserDataService,
    private turn: MainStore
  ) { }

  open() {
    this.visible = true;
  }

  close() {
    this.visible = false;
    this.selectedOption = null;
  }

  selectOption(option: any) {
    this.selectedOption = option;
  }

  async onSubmit() {
    if (!this.selectedOption) return;

    this.isSubmitting = true;

    try {
      // Simulate QR code payment verification
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Get current user's UID
      const uid = this.userService.getCurrentUserUid();
      
      // Get current number of turns (await the Promise)
      const currentTurns = await this.userService.getTurn() || 0;
      
      // Calculate new turn value
      const newTurnValue = currentTurns + this.selectedOption.turns;

      // Add turns to the user
      await this.userService.addTurn(newTurnValue);

      this.message.success(`Successfully purchased ${this.selectedOption.label}!`);
      this.isSubmitting = false;
      this.turn.setTurn();
      this.close();
    } catch (error) {
      console.error('Turn purchase error:', error);
      this.message.error('Failed to purchase turns. Please try again.');
      this.isSubmitting = false;
    }
}

}
