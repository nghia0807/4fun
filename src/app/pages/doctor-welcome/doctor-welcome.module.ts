import { CommonModule, DecimalPipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzImageModule } from 'ng-zorro-antd/image';
import { TimePickerComponent } from '../doctor/time-picker/time-picker.component';
import { DoctorWelcomeComponent } from './doctor-welcome.component';
import { DoctorWelcomePieChartComponent } from './doctor-welcome-pie-chart/doctor-welcome-pie-chart.component';
import { DoctorWelcomeBarChartComponent } from './doctor-welcome-bar-chart/doctor-welcome-bar-chart.component';
import { DoctorDataService } from '../../../data/doctor.service';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
const NzModules = [
  NzEmptyModule,
  NzImageModule,
  NzIconModule,
  NzDividerModule,
  NzButtonModule,
  NzGridModule,
  NzFormModule,
  NzSelectModule,
  NzDatePickerModule,
  NzInputModule,
  NzToolTipModule,
  NzDrawerModule,
  NzSwitchModule,
  NzCheckboxModule,
  NzModalModule,
  NzSpaceModule,
  NzSpinModule,
  NzAlertModule,
  NzInputNumberModule,
  NzTagModule,
  NzToolTipModule,
  NzRadioModule,
  NzResultModule,
  NzCardModule,
  NzStepsModule,
  NzTableModule,
  NzAvatarModule,
  FormsModule
];

@NgModule({
  declarations: [ DoctorWelcomeComponent, DoctorWelcomePieChartComponent, DoctorWelcomeBarChartComponent ],
  imports: [
    CommonModule,
    ...NzModules,
    TimePickerComponent,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: DoctorWelcomeComponent,
      },
    ]),
  ],
  providers: [DecimalPipe, DoctorDataService]
})
export class DoctorWelcomeModule { }
