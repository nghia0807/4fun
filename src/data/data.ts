import { Injectable } from '@angular/core';

export interface Appointment {
    key: string;
    doctor: string;
    room: string;
    day: string;
    month: string;
    year: string;
    time: string;
    meet: boolean;
}

export interface User {
    name: string;
    userName: string;
    phone: string;
    email: string;
    address: string;
}

export interface Doctor {
    name: string;
    specialization: string;
    imageUrl: string;
}

@Injectable({
    providedIn: 'root'
})

export class UserDataService {
    constructor() { }

    getUserName(): string {
        return 'tam';
    }

    getName(): string {
        return 'Nguyen Duc Tam';
    }

    getAddress(): string {
        return '288/ hoang van thu';
    }

    getPhoneNumber(): string {
        return '0123456789';
    }

    getEmail(): string {
        return 'email@gmail.com';
    }

    getAppointments(): Appointment[] {
        return [
            { key: '1', doctor: 'tam', room: 'a123', day: '1', month: '1', year: '1900', time: '0:00:00', meet: false },
            { key: '2', doctor: 'tam', room: 'a123', day: '1', month: '1', year: '1900', time: '0:00:00', meet: false },
            { key: '3', doctor: 'tam', room: 'a123', day: '1', month: '1', year: '1900', time: '0:00:00', meet: false }
        ];
    }

    getHistoryAppointments(): Appointment[] {
        return [
            { key: '1', doctor: 'tam', room: 'a123', day: '1', month: '1', year: '1900', time: '0:00:00', meet: true },
            { key: '2', doctor: 'tam', room: 'a123', day: '1', month: '1', year: '1900', time: '0:00:00', meet: true },
            { key: '3', doctor: 'tam', room: 'a123', day: '1', month: '1', year: '1900', time: '0:00:00', meet: true }
        ];
    }
}

export class System {
    getListDoctor(): Doctor[] {
        return [
            { name: 'trang', specialization: 'Khoa Tim Mạch', imageUrl: 'https://static.vecteezy.com/system/resources/previews/036/594/092/original/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg' },
            { name: 'bao', specialization: 'Khoa Thần Kinh', imageUrl: 'https://static.vecteezy.com/system/resources/previews/036/594/092/original/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg' },
            { name: 'minh', specialization: 'Khoa Sản Phụ Khoa', imageUrl: 'https://static.vecteezy.com/system/resources/previews/036/594/092/original/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg' },
            { name: 'quyen', specialization: 'Khoa Cấp Cứu', imageUrl: 'https://static.vecteezy.com/system/resources/previews/036/594/092/original/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg' },
            { name: 'trung', specialization: 'Khoa Nhi', imageUrl: 'https://static.vecteezy.com/system/resources/previews/036/594/092/original/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg' },
            { name: 'lam', specialization: 'Khoa Hồi Sức Tích Cực', imageUrl: 'https://static.vecteezy.com/system/resources/previews/036/594/092/original/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg' },
            { name: 'yen', specialization: 'Khoa Tiêu Hóa', imageUrl: 'https://static.vecteezy.com/system/resources/previews/036/594/092/original/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg' },
            { name: 'hoang', specialization: 'Khoa Da Liễu', imageUrl: 'https://static.vecteezy.com/system/resources/previews/036/594/092/original/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg' },
            { name: 'khanh', specialization: 'Khoa Xương Khớp', imageUrl: 'https://static.vecteezy.com/system/resources/previews/036/594/092/original/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg' },
            { name: 'phuc', specialization: 'Khoa Dinh Dưỡng', imageUrl: 'https://static.vecteezy.com/system/resources/previews/036/594/092/original/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg' },
            { name: 'duy', specialization: 'Khoa Răng Hàm Mặt', imageUrl: 'https://static.vecteezy.com/system/resources/previews/036/594/092/original/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg' },
            { name: 'chi', specialization: 'Khoa Nội Tiết', imageUrl: 'https://static.vecteezy.com/system/resources/previews/036/594/092/original/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg' },
            { name: 'hieu', specialization: 'Khoa Phổi', imageUrl: 'https://static.vecteezy.com/system/resources/previews/036/594/092/original/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg' },
            { name: 'my', specialization: 'Khoa Cơ Xương Khớp', imageUrl: 'https://static.vecteezy.com/system/resources/previews/036/594/092/original/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg' },
            { name: 'tuan', specialization: 'Khoa Mắt', imageUrl: 'https://static.vecteezy.com/system/resources/previews/036/594/092/original/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg' },
            { name: 'thu', specialization: 'Khoa Tai Mũi Họng', imageUrl: 'https://static.vecteezy.com/system/resources/previews/036/594/092/original/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg' },
            { name: 'luong', specialization: 'Khoa Nha Khoa', imageUrl: 'https://static.vecteezy.com/system/resources/previews/036/594/092/original/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg' },
            { name: 'huyen', specialization: 'Khoa Ung Bướu', imageUrl: 'https://static.vecteezy.com/system/resources/previews/036/594/092/original/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg' },
            { name: 'vui', specialization: 'Khoa Thận', imageUrl: 'https://static.vecteezy.com/system/resources/previews/036/594/092/original/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg' },
            { name: 'phuong', specialization: 'Khoa Gan Mật', imageUrl: 'https://static.vecteezy.com/system/resources/previews/036/594/092/original/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg' }
        ];        
    }

    getListNumber(): number {
        return this.getListDoctor().length;
    }
}

export class DoctorDataService {

}