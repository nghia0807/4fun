import { Component } from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';

interface appointment {
  key: string,
  doctor: string,
  room: string,
  day: string,
  month: string,
  year: string,
  time: string,
}


@Component({
  selector: 'app-history-list',
  standalone: true,
  imports: [
    NzTableModule
  ],
  templateUrl: './history-list.component.html',
  styleUrl: './history-list.component.css'
})
export class HistoryListComponent {

  list: appointment[] = [
    {
      key: '1',
      doctor: 'tam',
      room: 'a123',
      day: '1',
      month: '1',
      year: '1900',
      time: '0:00:00',
    },
    {
      key: '2',
      doctor: 'tam',
      room: 'a123',
      day: '1',
      month: '1',
      year: '1900',
      time: '0:00:00',
    },
    {
      key: '3',
      doctor: 'tam',
      room: 'a123',
      day: '1',
      month: '1',
      year: '1900',
      time: '0:00:00',
    }
  ]
}
