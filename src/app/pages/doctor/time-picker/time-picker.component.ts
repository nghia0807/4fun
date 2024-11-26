import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-time-picker',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzSelectModule,
    NzDatePickerModule,
    NzButtonModule
  ],
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.css']
})
export class TimePickerComponent implements OnInit {
  availableTimes: { time: string, selected: boolean, disabled?: boolean }[] = [];
  form: FormGroup;
  selectedTimeIndex: number | null = null;

  @Output() timeAndDateSelected = new EventEmitter<{ time: string, date: Date } | null>();

  constructor() {
    this.form = new FormGroup({
      date: new FormControl(null),
      time: new FormControl(null)
    });
  }

  ngOnInit() {
    this.generateAvailableTimes();
    this.loadSavedValues();
  }

  private loadSavedValues() {
    const savedDate = localStorage.getItem('selectedDate');
    const savedTime = localStorage.getItem('selectedTime');
    const savedTimeIndex = localStorage.getItem('selectedTimeIndex');

    if (savedDate) {
      const date = new Date(savedDate);
      this.form.get('date')?.setValue(date);
      this.updateAvailableTimes();

      if (savedTime && savedTimeIndex) {
        const index = parseInt(savedTimeIndex);
        if (!isNaN(index) && index >= 0 && index < this.availableTimes.length) {
          this.selectedTimeIndex = index;
          this.availableTimes[index].selected = true;
          this.form.get('time')?.setValue(savedTime);
        }
      }
    }
  }

  generateAvailableTimes() {
    const morningStart = 8;
    const morningEnd = 11;
    const afternoonStart = 13;
    const afternoonEnd = 17;

    this.availableTimes = [];

    for (let hour = morningStart; hour <= morningEnd; hour++) {
      this.availableTimes.push({ 
        time: `${hour.toString().padStart(2, '0')}:00`, 
        selected: false 
      });
      if (hour < morningEnd) {
        this.availableTimes.push({ 
          time: `${hour.toString().padStart(2, '0')}:30`, 
          selected: false 
        });
      }
    }

    for (let hour = afternoonStart; hour <= afternoonEnd; hour++) {
      this.availableTimes.push({ 
        time: `${hour.toString().padStart(2, '0')}:00`, 
        selected: false 
      });
      if (hour < afternoonEnd) {
        this.availableTimes.push({ 
          time: `${hour.toString().padStart(2, '0')}:30`, 
          selected: false 
        });
      }
    }

    this.availableTimes.forEach(time => time.disabled = true);
  }

  disableDateFn = (current: Date): boolean => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return current.getTime() < tomorrow.getTime();
  };

  onDateChange(date: Date | null): void {
    if (date) {
      localStorage.setItem('selectedDate', date.toISOString());
      this.updateAvailableTimes();

      // Kiểm tra xem time đã chọn trước đó có còn hợp lệ không
      if (this.selectedTimeIndex !== null) {
        const selectedTime = this.availableTimes[this.selectedTimeIndex];
        if (selectedTime && !selectedTime.disabled) {
          this.timeAndDateSelected.emit({
            time: selectedTime.time,
            date: date
          });
        } else {
          // Nếu time không còn hợp lệ, xóa selection
          this.clearTimeSelection();
        }
      }
    } else {
      this.clearSelections();
    }
  }

  updateAvailableTimes() {
    const selectedDate = this.form.get('date')?.value;

    if (selectedDate) {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const isToday = selectedDate.getDate() === now.getDate() &&
                      selectedDate.getMonth() === now.getMonth() &&
                      selectedDate.getFullYear() === now.getFullYear();

      this.availableTimes.forEach(timeSlot => {
        if (selectedDate.getTime() < tomorrow.getTime()) {
          timeSlot.disabled = true;
        } else if (isToday) {
          const [hours, minutes] = timeSlot.time.split(':').map(Number);
          const timeDate = new Date(selectedDate);
          timeDate.setHours(hours, minutes, 0, 0);
          timeSlot.disabled = timeDate.getTime() <= now.getTime();
        } else {
          timeSlot.disabled = false;
        }
      });
    } else {
      this.availableTimes.forEach(timeSlot => {
        timeSlot.disabled = true;
        timeSlot.selected = false;
      });
    }
  }

  onTimeSelect(selectedTime: { time: string, selected: boolean, disabled?: boolean }, index: number) {
    if (!this.form.get('date')?.value || selectedTime.disabled) return;

    const currentDate = this.form.get('date')?.value;
    
    if (selectedTime.selected) {
      // Bỏ chọn time hiện tại
      this.clearTimeSelection();
    } else {
      // Clear previous selection
      if (this.selectedTimeIndex !== null) {
        this.availableTimes[this.selectedTimeIndex].selected = false;
      }
      
      // Set new selection
      selectedTime.selected = true;
      this.selectedTimeIndex = index;
      this.form.get('time')?.setValue(selectedTime.time);
      
      // Save to localStorage
      localStorage.setItem('selectedTime', selectedTime.time);
      localStorage.setItem('selectedTimeIndex', index.toString());

      if (currentDate) {
        this.timeAndDateSelected.emit({
          time: selectedTime.time,
          date: currentDate
        });
      }
    }
  }

  private clearTimeSelection() {
    if (this.selectedTimeIndex !== null) {
      this.availableTimes[this.selectedTimeIndex].selected = false;
    }
    this.selectedTimeIndex = null;
    this.form.get('time')?.setValue(null);
    localStorage.removeItem('selectedTime');
    localStorage.removeItem('selectedTimeIndex');
    this.timeAndDateSelected.emit(null);
  }

  clearSelections() {
    this.form.reset();
    this.availableTimes.forEach(time => {
      time.selected = false;
      time.disabled = true;
    });
    this.selectedTimeIndex = null;
    localStorage.removeItem('selectedDate');
    localStorage.removeItem('selectedTime');
    localStorage.removeItem('selectedTimeIndex');
    this.timeAndDateSelected.emit(null);
  }
}