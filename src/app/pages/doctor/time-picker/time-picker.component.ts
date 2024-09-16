import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';

@Component({
  selector: 'app-time-picker',
  standalone: true,
  imports: [CommonModule, FormsModule, NzSelectModule, NzDatePickerModule],
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.css']
})
export class TimePickerComponent implements OnInit {
  availableTimes: { time: string, selected: boolean }[] = [];
  selectedTime: string = '';
  selectedDate: Date | null = null;

  ngOnInit() {
    this.generateAvailableTimes();
  }

  generateAvailableTimes() {
    const morningStart = 8;
    const morningEnd = 11;
    const afternoonStart = 13;
    const afternoonEnd = 17;

    for (let hour = morningStart; hour <= morningEnd; hour++) {
      this.availableTimes.push({ time: `${hour}:00`, selected: false });
      if (hour < morningEnd) {
        this.availableTimes.push({ time: `${hour}:30`, selected: false });
      }
    }

    for (let hour = afternoonStart; hour <= afternoonEnd; hour++) {
      this.availableTimes.push({ time: `${hour}:00`, selected: false });
      if (hour < afternoonEnd) {
        this.availableTimes.push({ time: `${hour}:30`, selected: false });
      }
    }
  }

  onDateChange(result: Date): void {
    this.selectedDate = result;
    console.log('Selected date:', this.selectedDate);
  }

  onTimeSelect(selectedTime: { time: string, selected: boolean }) {
    this.availableTimes.forEach(time => time.selected = false);
    selectedTime.selected = true;
    this.selectedTime = selectedTime.time;
    if (this.selectedDate) {
      console.log(`Selected time: ${this.selectedTime} on ${this.selectedDate.toDateString()}`);
    }
  }
}
