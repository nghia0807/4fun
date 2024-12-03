import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
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
  @Input() disabledTimeStrings: string[] = [];
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

    this.updateDisabledTimes();
  }

  updateDisabledTimes() {
    const selectedDate = this.form.get('date')?.value;
    
    if (selectedDate && this.disabledTimeStrings.length > 0) {
      // Chuyển đổi ngày được chọn sang định dạng YYMMDD
      const selectedDateStr = this.formatDateToString(selectedDate);
  
      this.availableTimes.forEach(timeSlot => {
        const matchingDisabledTime = this.disabledTimeStrings.some(timeStr => {
          // Tách date và time từ chuỗi disabled time
          const [disabledDateStr, disabledTime] = timeStr.split(' ');
          
          // Kiểm tra cả date và time
          return disabledDateStr === selectedDateStr && disabledTime === timeSlot.time;
        });
  
        // Disable time slot nếu được tìm thấy
        timeSlot.disabled = matchingDisabledTime;
      });
    } else {
      // Reset trạng thái disabled nếu không có time bị disable
      this.updateAvailableTimes();
    }
  }
  
  // Thêm phương thức để format date
  private formatDateToString(date: Date): string {
    const year = date.getFullYear().toString().slice(2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}${month}${day}`;
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
      this.updateDisabledTimes(); // Additional call to handle disabled times

      // Rest of the existing method remains the same...
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

  @Input() set disabledTimes(timeStrings: string[]) {
    this.disabledTimeStrings = timeStrings;
    this.updateDisabledTimes();
  }
}