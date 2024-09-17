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
    tag: string;
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
            { name: 'trang', specialization: 'Cardiology', tag: 'tm', imageUrl: 'https://static.vecteezy.com/system/resources/previews/036/594/092/original/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg' },
            { name: 'bao', specialization: 'Neurology', tag: 'tk', imageUrl: 'https://static.vecteezy.com/system/resources/previews/036/594/092/original/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg' },
            { name: 'minh', specialization: 'Obstetrics and Gynecology', tag: 'ps', imageUrl: 'https://static.vecteezy.com/system/resources/previews/036/594/092/original/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg' },
            { name: 'quyen', specialization: 'Pediatrics', tag: 'n', imageUrl: 'https://static.vecteezy.com/system/resources/previews/036/594/092/original/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg' },
            { name: 'trung', specialization: 'Pediatrics', tag: 'n', imageUrl: 'https://static.vecteezy.com/system/resources/previews/036/594/092/original/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg' },
            { name: 'lam', specialization: 'Obstetrics and Gynecology', tag: 'spk', imageUrl: 'https://static.vecteezy.com/system/resources/previews/036/594/092/original/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg' },
            { name: 'yen', specialization: 'Gastroenterology', tag: 'th', imageUrl: 'https://static.vecteezy.com/system/resources/previews/036/594/092/original/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg' },
            { name: 'hoang', specialization: 'Dermatology', tag: 'dl', imageUrl: 'https://static.vecteezy.com/system/resources/previews/036/594/092/original/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg' },
            { name: 'khanh', specialization: 'Rheumatology', tag: 'xk', imageUrl: 'https://static.vecteezy.com/system/resources/previews/036/594/092/original/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg' },
            { name: 'phuc', specialization: 'Nutrition', tag: 'dd', imageUrl: 'https://static.vecteezy.com/system/resources/previews/036/594/092/original/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg' },
            { name: 'duy', specialization: 'Dentistry', tag: 'rhm', imageUrl: 'https://static.vecteezy.com/system/resources/previews/036/594/092/original/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg' },
            { name: 'chi', specialization: 'Endocrinology', tag: 'nt', imageUrl: 'https://static.vecteezy.com/system/resources/previews/036/594/092/original/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg' },
            { name: 'hieu', specialization: 'Pulmonology', tag: 'p', imageUrl: 'https://static.vecteezy.com/system/resources/previews/036/594/092/original/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg' },
            { name: 'my', specialization: 'Musculoskeletal', tag: 'cxk', imageUrl: 'https://static.vecteezy.com/system/resources/previews/036/594/092/original/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg' },
            { name: 'tuan', specialization: 'Ophthalmology', tag: 'm', imageUrl: 'https://static.vecteezy.com/system/resources/previews/036/594/092/original/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg' },
            { name: 'thu', specialization: 'Ear, Nose, and Throat', tag: 'tmh', imageUrl: 'https://static.vecteezy.com/system/resources/previews/036/594/092/original/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg' },
            { name: 'luong', specialization: 'Dentistry', tag: 'nk', imageUrl: 'https://static.vecteezy.com/system/resources/previews/036/594/092/original/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg' },
            { name: 'huyen', specialization: 'Oncology', tag: 'ub', imageUrl: 'https://static.vecteezy.com/system/resources/previews/036/594/092/original/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg' },
            { name: 'vui', specialization: 'Nephrology', tag: 't', imageUrl: 'https://static.vecteezy.com/system/resources/previews/036/594/092/original/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg' },
            { name: 'phuong', specialization: 'Hepatobiliary', tag: 'gm', imageUrl: 'https://static.vecteezy.com/system/resources/previews/036/594/092/original/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg' }
        ];        
    }    

    getListNumber(): number {
        return this.getListDoctor().length;
    }
}

export class DoctorDataService {

}