import { Component } from '@angular/core';
import { ListComponent } from './list/list.component';
import { HistoryListComponent } from './history-list/history-list.component';

@Component({
  selector: 'app-monitor',
  standalone: true,
  imports: [
    ListComponent,
    HistoryListComponent
  ],
  templateUrl: './monitor.component.html',
  styleUrl: './monitor.component.css'
})
export class MonitorComponent {
  

  
}
