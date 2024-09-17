import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterDoctorComponent } from './filter-doctor.component';

describe('FilterDoctorComponent', () => {
  let component: FilterDoctorComponent;
  let fixture: ComponentFixture<FilterDoctorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterDoctorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FilterDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
