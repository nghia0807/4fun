import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, ActivatedRoute } from '@angular/router';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { Router } from '@angular/router';
@Component({
  selector: 'app-main-app',
  standalone: true,
  imports: [ 
    RouterOutlet,
    RouterLink,
    NzLayoutModule,
    NzMenuModule,
    RouterLinkActive,
  ],
  templateUrl: './main-app.component.html',
  styleUrl: './main-app.component.css'
})
export class MainAppComponent {
  constructor(
    private router: Router
  ){}



  logOut(){
    this.router.navigate(['']);
  }
}
