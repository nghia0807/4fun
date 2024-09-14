import { Component, OnInit } from '@angular/core';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { CommonModule } from '@angular/common';

interface Doctor {
  name: string;
  specialization: string;
  imageUrl: string;
}

@Component({
  selector: 'app-doctor',
  standalone: true,
  imports: [
    CommonModule,
    NzGridModule,
    NzCardModule,
    NzIconModule,
    NzPaginationModule
  ],
  templateUrl: './doctor.component.html',
  styleUrl: './doctor.component.css'
})
export class DoctorComponent implements OnInit {
  doctors: Doctor[] = [];
  currentPage = 1;
  totalDoctors = 0;

  ngOnInit() {
    // Simulating data fetch. In a real app, you'd get this from a service.
    this.doctors = Array(100).fill(0).map((_, i) => ({
      name: `Doctor ${i + 1}`,
      specialization: `Specialization ${(i % 5) + 1}`,
      imageUrl: `https://static.vecteezy.com/system/resources/previews/036/594/092/original/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg`
    }));
    this.totalDoctors = this.doctors.length;
  }

  pageChanged(page: number) {
    this.currentPage = page;
  }
}