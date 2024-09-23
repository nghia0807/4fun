import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { WelcomeFormComponent } from '../../welcome/welcome-form/welcome-form.component';

@Component({
  selector: 'app-filter-doctor',
  standalone: true,
  imports: [
    FormsModule,
    NzInputModule,
    NzSelectModule
  ],
  templateUrl: './filter-doctor.component.html',
  styleUrls: ['./filter-doctor.component.css']
})
export class FilterDoctorComponent {
  @Output() filterChanged = new EventEmitter<{ searchTerm: string, tag: string }>();
  searchTerm: string = '';
  selectedTag: string = 'all';

  onFilterChange() {
    this.filterChanged.emit({
      searchTerm: this.searchTerm,
      tag: this.selectedTag,
    });
    console.log(this.selectedTag);
  }

  setFilter(value: string) {
    this.selectedTag = value;
    this.onFilterChange();
  }
}
