import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, updateDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { BehaviorSubject } from 'rxjs';
import { AppointmentStatus } from '../component/enum';
const firebaseConfig = {
  apiKey: "AIzaSyBKbsUGLmXtM_JZfXb-iZHfIRv-PRht63o",
  authDomain: "onlineappointment-44466.firebaseapp.com",
  databaseURL: "https://onlineappointment-44466-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "onlineappointment-44466",
  storageBucket: "onlineappointment-44466.firebasestorage.app",
  messagingSenderId: "801784802094",
  appId: "1:801784802094:web:a071f31edb6bac06fde8bf",
  measurementId: "G-MEEY6NXNPP"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);  // Firestore instance
const auth = getAuth(app);

export interface User {
  name: string;
  phoneNumber: string;
  email: string;
  address: string;
  turn: number;
  appointments: AppointmentData[];
}

export interface AppointmentData {
  key: string;
  appointmentDate: string;
  appointmentTime: string;
  doctorName: string;
  createdAt: string;
  healthCondition: string;
  status: AppointmentStatus;
  comment: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  tag: string;
  imageUrl: string;
  description: string;
}

// use for the table
export interface UserAppointment {
  id: number;
  patientName: string;
  comment: string;
  status: AppointmentStatus;
  appointmentDate: Date;
}

// use for the drawer
export interface AppointmentValue {
  id: number;
  patientName: string;
  birth: Date;
  address: string;
  comment: string;
  appointmentDate: Date;
}

@Injectable({
  providedIn: 'root',
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

  async getAllPatients(): Promise<User[]> {
    try {
      const usersRef = collection(db, 'users');
      const querySnapshot = await getDocs(usersRef);
      const users: User[] = [];
      querySnapshot.forEach((doc) => {
        users.push(doc.data() as User);
      });
      return users;
    } catch (e) {
      console.log('Error getting data or there is no patient');
      return [];
    }
  }

  private fetchUserData(uid: string) {
    const userRef = doc(db, 'users', uid);
    getDoc(userRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          this.currentUser = { ...this.currentUser, ...snapshot.data() };
          this.userDataSubject.next(this.currentUser);
        }
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
      });
  }

  getUserData() {
    return this.userDataSubject.asObservable();
  }

  refreshUserData(uid: string) {
    this.fetchUserData(uid);
  }

  async getAppointments(uid: string): Promise<AppointmentData[]> {
    if (uid === '') uid = this.currentUser.uid;
    try {
      const appointmentsRef = collection(db, `users/${uid}/appointments`);
      const querySnapshot = await getDocs(appointmentsRef);
      const appointments: AppointmentData[] = [];
      querySnapshot.forEach((doc) => {
        appointments.push(doc.data() as AppointmentData);
      });
      return appointments;
    } catch (e) {
      console.log('Error fetching appointments or current user is null');
      return [];
    }
  }

  private async markAppointmentAsMet(uid: string, appointmentKey: string): Promise<void> {
    const appointmentRef = doc(db, `users/${uid}/appointments`, appointmentKey);
    try {
      await updateDoc(appointmentRef, { meet: true });
    } catch (error) {
      console.error('Error marking appointment as met:', error);
    }
  }

  async createAppointment(
    uid: string,
    doctorId: string,
    doctorName: string,
    time: string,
    date: Date,
    comment: string
  ) {
    const appointmentId = this.generateAppointmentId(date, time, doctorId);
    const appointmentRef = doc(db, `users/${uid}/appointments`, appointmentId);
    try {
      await setDoc(appointmentRef, {
        doctorName,
        appointmentTime: time,
        appointmentDate: date.toISOString(),
        healthCondition: '',
        createdAt: new Date().toISOString(),
        comment,
        status: AppointmentStatus.READY,
      } as AppointmentData);
      console.log('Appointment created successfully.');
      return appointmentId;
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }
  }

  private generateAppointmentId(date: Date, time: string, doctorName: string): string {
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const [hours, minutes] = time.split(':');
    const doctorNamePart = doctorName.replace(/\s+/g, '').toUpperCase();

    return `${doctorNamePart}${year}${month}${day}${hours}${minutes}`;
  }

  public getCurrentUserUid(): string {
    return this.currentUser.uid;
  }

  public getCurrentUserEmail(): string {
    return this.currentUser.email;
  }

  public getCurrentUserName(): string {
    return this.currentUser.name;
  }

  async cancelAppointment(appointmentKey: string): Promise<void> {
    const uid = this.getCurrentUserUid();
    const appointmentRef = doc(db, `users/${uid}/appointments`, appointmentKey);
    try {
      await updateDoc(appointmentRef, { status: AppointmentStatus.CANCEL });
      console.log('Appointment cancelled successfully.');
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      throw error;
    }
  }
}

export class System {
  doctorList: Doctor[] = [];
  doctorListAvailable = false;

  async getListDoctor(): Promise<Doctor[]> {
    if (this.doctorListAvailable) return this.doctorList;
    const doctorsRef = collection(db, 'doctors');
    const querySnapshot = await getDocs(doctorsRef);
    querySnapshot.forEach((doc) => {
      this.doctorList.push(doc.data() as Doctor);
    });
    return this.doctorList;
  }

  getListNumber(): number {
    return this.doctorList.length;
  }
}

export class DoctorDataService {
  private doctorID: string;
  private appointmentList: AppointmentData[] = [];

  constructor(doctorID: string) {
    this.doctorID = doctorID;
    this.fetchDoctorAppointment();
  }

  private async fetchDoctorAppointment() {
    const docRef = collection(db, `Doctors/${this.doctorID}/appointments`);
    const snapShot = await getDocs(docRef);

    if (!snapShot.empty) {
      this.appointmentList = snapShot.docs.map(doc => ({
        key: doc.id,
        ...doc.data(),
      })) as AppointmentData[];
    }
  }

  public getDoctorAppointment() {
    return this.appointmentList;
  }

  public async updateDoctorAppointment(appointment: AppointmentData): Promise<void> {
    try {
      const docRef = doc(db, `Doctors/${this.doctorID}/appointments`, appointment.key);
      // await updateDoc(docRef, appointment);
      await updateDoc(docRef, {
        appointmentDate: appointment.appointmentDate,
        appointmentTime: appointment.appointmentTime,
        doctorName: appointment.doctorName,
        healthCondition: appointment.healthCondition,
        createdAt: appointment.createdAt,
        comment: appointment.comment,
        status: appointment.status
      });
      console.log('Updated appointment:', appointment);
    } catch (e) {
      console.error(e);
    }
  }


  public async doctorStatistics() {
    try {
      const docRef = collection(db, `Doctors/${this.doctorID}/appointments`);
      const appointmentsSnap = await getDocs(docRef);
      const statistics = {
        cancel: 0,
        meeting: 0,
        ready: 0,
        ended: 0,
      };

      if (!appointmentsSnap.empty) {
        const appointments = appointmentsSnap.docs.map(doc => doc.data());

        return appointments.forEach((appointment) => {
          const state = appointment['status'];
          if (state === AppointmentStatus.CANCEL) statistics.cancel += 1;
          if (state === AppointmentStatus.MEETING) statistics.meeting += 1;
          if (state === AppointmentStatus.READY) statistics.ready += 1;
          if (state === AppointmentStatus.ENDED) statistics.ended += 1;
        });
      } else {
        console.log('No appointments found for this doctor.');
      }
    }catch (e)
    {
      console.error(e);
    }
  }
}
