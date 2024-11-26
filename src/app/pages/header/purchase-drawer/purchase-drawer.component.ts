import { Component } from '@angular/core';
import { NzDrawerComponent } from 'ng-zorro-antd/drawer';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { CommonModule } from '@angular/common';
import { NzQRCodeModule } from 'ng-zorro-antd/qr-code';
import { NzMessageComponent, NzMessageService } from 'ng-zorro-antd/message';

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
      qrCode: 'https://www.youtube.com/watch?v=9mL4iZ5pfo8'
    },
    {
      label: '2 Turn',
      amount: -200000,
      qrCode: 'https://puu.sh/hZch4/d39e8b4ef4.jpg'
    },
    {
      label: '3 Turn',
      amount: -300000,
      qrCode: 'www.imgur.com/a/G6rU8'
    },
    {
      label: '4 Turn',
      amount: -400000,
      qrCode: 'https://tinyurl.com/5x2bcwjy'
    },
    {
      label: '5 Turn',
      amount: -500000,
      qrCode: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
    }
  ];

  constructor(private message: NzMessageService) { }

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

  onSubmit() {
    if (!this.selectedOption) return;

    this.isSubmitting = true;

    // Simulate QR code loading and submission
    setTimeout(() => {
      this.message.success('Payment submitted successfully!');
      this.isSubmitting = false;
      this.close();
    }, 2000);
  }
}
