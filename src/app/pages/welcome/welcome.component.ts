import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { WelcomeFormComponent } from './welcome-form/welcome-form.component';
@Component({
  standalone: true,
  imports: [ WelcomeFormComponent ],
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css',
  encapsulation: ViewEncapsulation.None
})
export class WelcomeComponent {
  @ViewChild(WelcomeFormComponent) formComponent!: WelcomeFormComponent;

  onDetail(): void {
    this.formComponent.open();
  }
}
