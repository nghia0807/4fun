import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { DoctorStore } from '../doctor.store';
import { Subject } from 'rxjs';

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
export class FilterDoctorComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  searchTerm: string = '';
  
  @Input() selectedTag: string = 'all';

  constructor(private store: DoctorStore) {}

  ngOnInit() {
    this.onFilterChange();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.store.setInitialTag('all');
  }

  onFilterChange() {
    this.store.setFiltersSearch(this.searchTerm);
    this.store.setFiltersTag(this.selectedTag);
  }

  setFilter(value: string) {
    this.selectedTag = value;
    this.onFilterChange();
  }
}