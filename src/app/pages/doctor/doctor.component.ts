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
  ],
  templateUrl: './doctor.component.html',
  styleUrl: './doctor.component.css',
  providers: [System]
})
export class DoctorComponent implements OnInit {
  doctors: Doctor[] = [];
  currentPage = 1;
  totalDoctors = 0;

  constructor(
    private modalService: NzModalService,
    private data: System,
    private message: NzMessageService
  ) { }

  ngOnInit() {
    this.doctors = this.data.getListDoctor();
    this.totalDoctors = this.data.getListNumber();
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
                concatMap(() => this.message.success('Registering appointment', { nzDuration: 2500 }).onClose!),
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