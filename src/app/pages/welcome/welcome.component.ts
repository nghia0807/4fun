import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { WelcomeFormComponent } from './welcome-form/welcome-form.component';
import { MainStore } from '../main-app.component.store';
import { MainAppComponent } from '../main-app.component';
import { System } from '../../../data/data';
import { DoctorStore } from '../doctor/doctor.store';
import { TimePickerComponent } from '../doctor/time-picker/time-picker.component';
@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css',
  providers: [MainStore, WelcomeFormComponent, DoctorStore, TimePickerComponent]
})
export class WelcomeComponent {
  @ViewChild(WelcomeFormComponent) formComponent!: WelcomeFormComponent;

  blured: boolean = false;
  constructor (
    private mainStore: MainStore,
    private guide : MainAppComponent,
    private drawer: WelcomeFormComponent
   )  {
    this.mainStore.bluredSlider$.subscribe((x) => {
      this.blured = x;
    })
  }
  onDetail(): void {
    this.formComponent.open();
    this.drawer.resetForm();
  }
  onBlur(value: boolean): void {
    this.guide.hightLightHeader(true);
  }
}
