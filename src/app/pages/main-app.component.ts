import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';

@Component({
  selector: 'app-main-app',
  standalone: true,
  imports: [ RouterOutlet, RouterLink, NzLayoutModule, NzMenuModule],
  templateUrl: './main-app.component.html',
  styleUrl: './main-app.component.css'
})
export class MainAppComponent {

}
