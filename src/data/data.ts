import { Injectable } from '@angular/core';
import { getDatabase, ref, set, get, update, remove } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './firebaseConfig';
import { BehaviorSubject } from 'rxjs';

const app = initializeApp(firebaseConfig);
const db = getDatabase();
const auth = getAuth(app);

export interface Appointment {
    key: string;
    doctor: string;
    date: string;
    time: string;
    meet: boolean;
}

export interface User {
    name: string;
    phoneNumber: string;
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
    private currentUser: any = null;
    private userDataSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);

    constructor() {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                this.currentUser = user;
                this.fetchUserData(user.uid);
            } else {
                this.currentUser = null;
                this.userDataSubject.next(null);
            }
        });
    }

    private fetchUserData(uid: string) {
        const userRef = ref(db, `users/${uid}`);
        get(userRef).then((snapshot) => {
            if (snapshot.exists()) {
                this.currentUser = { ...this.currentUser, ...snapshot.val() };
                this.userDataSubject.next(this.currentUser);
            }
        }).catch((error) => {
            console.error("Error fetching user data:", error);
        });
    }

    getUserData() {
        return this.userDataSubject.asObservable();
    }

    refreshUserData(uid: string) {
        this.fetchUserData(uid)
    }

    async getAppointments(includeHistory: boolean = false): Promise<Appointment[]> {
        const uid = this.getCurrentUserUid();
        const appointmentsRef = ref(db, `users/${uid}/appointments`);
        
        try {
            const snapshot = await get(appointmentsRef);
            if (!snapshot.exists()) return [];

            const now = new Date();
            return Object.entries(snapshot.val() || {})
                .filter(([_, appointmentData]: [string, any]) => {
                    const appointmentDateTime = this.combineDateTime(appointmentData.appointmentDate, appointmentData.appointmentTime);
                    const isPastAppointment = appointmentDateTime < now;
                    return includeHistory ? isPastAppointment : !isPastAppointment;
                })
                .map(([key, appointmentData]: [string, any]) => {
                    const appointmentDateTime = this.combineDateTime(appointmentData.appointmentDate, appointmentData.appointmentTime);
                    const isPastAppointment = appointmentDateTime < now;
                    
                    if (isPastAppointment && !appointmentData.meet) {
                        this.markAppointmentAsMet(uid, key);
                    }

                    return {
                        key,
                        doctor: appointmentData.doctorName,
                        date: new Date(appointmentData.appointmentDate).toLocaleDateString(),
                        time: appointmentData.appointmentTime,
                        meet: isPastAppointment
                    };
                });
        } catch (error) {
            console.error("Error fetching appointments:", error);
            return [];
        }
    }

    private async markAppointmentAsMet(uid: string, appointmentKey: string): Promise<void> {
        const appointmentRef = ref(db, `users/${uid}/appointments/${appointmentKey}`);
        try {
            await update(appointmentRef, { meet: true });
        } catch (error) {
            console.error("Error marking appointment as met:", error);
        }
    }

    private combineDateTime(date: string, time: string): Date {
        const [hours, minutes] = time.split(':').map(Number);
        const dateTime = new Date(date);
        dateTime.setHours(hours, minutes, 0, 0);
        return dateTime;
    }

    createAppointment(uid: string, doctorName: string, time: string, date: Date) {
        const appointmentId = this.generateAppointmentId(date, time);
        const appointmentRef = ref(db, `users/${uid}/appointments/${appointmentId}`);
        
        return set(appointmentRef, {
            doctorName: doctorName,
            appointmentTime: time,
            appointmentDate: date.toISOString(),
            createdAt: new Date().toISOString()
        })
        .then(() => {
            console.log("Appointment created successfully.");
            return appointmentId; // Return the new appointment ID
        })
        .catch((error) => {
            console.error("Error creating appointment:", error);
            throw error;
        });
    }

    private generateAppointmentId(date: Date, time: string): string {
        const year = date.getFullYear().toString().slice(-2);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const [hours, minutes] = time.split(':');
        
        return `${year}${month}${day}${hours}${minutes}`;
    }

    public getCurrentUserUid(): string {
        return this.currentUser.uid;
    }

    async cancelAppointment(appointmentKey: string): Promise<void> {
        const uid = this.getCurrentUserUid();
        const appointmentRef = ref(db, `users/${uid}/appointments/${appointmentKey}`);
        
        try {
            await remove(appointmentRef);
            console.log("Appointment cancelled successfully.");
        } catch (error) {
            console.error("Error cancelling appointment:", error);
            throw error;
        }
    }
}

export class System {
    getListDoctor(): Doctor[] {
        return [
            { name: 'trang', specialization: 'Cardiology', tag: 'tm', imageUrl: 'https://static.vecteezy.com/system/resources/previews/036/594/092/original/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg' },
            { name: 'bao', specialization: 'Neurology', tag: 'tk', imageUrl: 'https://static.vecteezy.com/system/resources/previews/036/594/092/original/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg' },
            { name: 'yen', specialization: 'Gastroenterology', tag: 'th', imageUrl: 'https://static.vecteezy.com/system/resources/previews/036/594/092/original/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg' },
            { name: 'hoang', specialization: 'Dermatology', tag: 'dl', imageUrl: 'https://static.vecteezy.com/system/resources/previews/036/594/092/original/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg' },
            { name: 'thu', specialization: 'Ear, Nose, and Throat', tag: 'tmh', imageUrl: 'https://static.vecteezy.com/system/resources/previews/036/594/092/original/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg' }
        ];
    }

    getListNumber(): number {
        return this.getListDoctor().length;
    }
}

export class DoctorDataService {

}

//tạo  data structure cho bác sĩ