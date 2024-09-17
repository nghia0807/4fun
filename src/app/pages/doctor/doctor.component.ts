import { Component, OnInit, Input } from '@angular/core';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { CommonModule } from '@angular/common';
import { NzModalModule, NzModalService, NzModalRef } from 'ng-zorro-antd/modal';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { DoctorModalComponent } from './doctor-modal/doctor-modal.component';
import { Doctor, System } from '../../../data/data';
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';
import { concatMap } from 'rxjs/operators';
import { FilterDoctorComponent } from './filter-doctor/filter-doctor.component';

@Component({
  selector: 'app-doctor',
  standalone: true,
  imports: [
    CommonModule,
    NzGridModule,
    NzCardModule,
    NzIconModule,
    NzPaginationModule,
    NzModalModule,
    NzButtonModule,
    DoctorModalComponent,
    NzMessageModule,
    FilterDoctorComponent
  ],
  templateUrl: './doctor.component.html',
  styleUrl: './doctor.component.css',
  providers: [System]
})
export class DoctorComponent implements OnInit {
  doctors: Doctor[] = [];
  filteredDoctors: Doctor[] = [];
  currentPage = 1;
  totalDoctors = 0;
  searchTerm: string = '';
  selectedTag: string = '';

  constructor(
    private modalService: NzModalService,
    private data: System,
    private message: NzMessageService
  ) { }

  ngOnInit() {
    this.doctors = this.data.getListDoctor();
    this.totalDoctors = this.data.getListNumber();
    this.filterDoctors(); 
  }

  onFilterChanged(event: { searchTerm: string, tag: string }) {
    this.searchTerm = event.searchTerm;
    if (event.tag === 'all') {
        this.selectedTag = '';
    } else {
        this.selectedTag = event.tag;
    }
    this.filterDoctors();
}

  filterDoctors() {
    this.filteredDoctors = this.doctors.filter(doctor => {
      const matchesName = this.searchTerm === '' || doctor.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesTag = this.selectedTag === '' || doctor.tag === this.selectedTag;
      return matchesName && matchesTag;
    });
    this.totalDoctors = this.filteredDoctors.length;
  }

  pageChanged(page: number) {
    this.currentPage = page;
  }

  showRegistrationModal(doctor: Doctor): void {

    const modal: NzModalRef = this.modalService.create({
      nzTitle: `You are registering with Dr.${doctor.name}`,
      nzContent: DoctorModalComponent,
      nzData: {
        doctor: doctor
      },
      nzFooter: [
        {
          label: 'Hủy',
          onClick: () => modal.close()
        },
        {
          label: 'Đăng ký',
          type: 'primary',
          onClick: () => {
            this.message
              .loading('Action in progress', { nzDuration: 2500 })
              .onClose!.pipe(
                concatMap(() => this.message.success('Registering appointment successfully', { nzDuration: 2500 }).onClose!),
                concatMap(() => this.message.info('Registering is finished', { nzDuration: 2500 }).onClose!)
              )
              .subscribe(() => {
                console.log('All completed!');
              });
            modal.close();
          }
        }
      ]
    });
  }
}