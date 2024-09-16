import { Component, OnInit } from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';
import { UserDataService, Appointment } from '../../../../data/data';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [NzTableModule],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  appointments: Appointment[] = [];

  constructor(private userDataService: UserDataService) {}

  ngOnInit() {
    this.appointments = this.userDataService.getAppointments();
  }
}