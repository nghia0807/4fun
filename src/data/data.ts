import { Injectable } from '@angular/core';
import { getDatabase, ref, set, get, update } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './firebaseConfig';
import { BehaviorSubject } from 'rxjs';
import { AppointmentStatus } from '../component/enum';
const app = initializeApp(firebaseConfig);
const db = getDatabase();
const auth = getAuth(app);

export interface Appointment {
  key: string;
  doctor: string;
  date: string;
  time: string;
  status: AppointmentStatus
}

export interface User {
  name: string;
  phoneNumber: string;
  email: string;
  address: string;
  turn: number;
  appointments: AppointmentData[]
}

export interface AppointmentData {
  appointmentDate: string;
  appointmentTime: string;
  doctorName: string;
  createdAt: string;
  healthCondition: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  tag: string;
  imageUrl: string;
  description: string;
}

//use for the table
export interface UserAppointment {
  id: number;
  patientName: string;
  comment: string;
  status: AppointmentStatus;
  appointmentDate: Date;
}

//use for the drawer
export interface Appointmentvalue {
  id: number;
  patientName: string;
  birth: Date;
  address: string;
  comment: string;
  appointmentDate: Date;
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

  async getAllPatients(): Promise<User[]> {
    const patientsRef = ref(db, 'users');
    try {
      const snapshot = await get(patientsRef);
      if (snapshot.exists()) {
        const users = snapshot.val() as Record<string, any>;
        return Object.entries(users).map(([uid, userData]) => ({
          uid,
          name: userData.name || '',
          phoneNumber: userData.phoneNumber || '',
          email: userData.email || '',
          address: userData.address || '',
          turn: 0, // Adding turn to match User interface
          appointments: userData.appointments
            ? Object.entries(userData.appointments)
              .filter(([_, appointmentData]) => typeof appointmentData === 'object')
              .map(([key, appointmentData]) => {
                const appointment = appointmentData as AppointmentData;
                return {
                  key,
                  doctorName: appointment.doctorName || '',
                  appointmentDate: appointment.appointmentDate || '',
                  appointmentTime: appointment.appointmentTime || '',
                  createdAt: appointment.createdAt || '',
                  healthCondition: appointment.healthCondition || ''
                };
              })
            : []
        })) as User[];
      }
      return [];
    } catch (error) {
      console.error("Error fetching patients:", error);
      return [];
    }
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
            meet: isPastAppointment,
            status: AppointmentStatus.MEETING
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
  createAppointment(uid: string, doctorId: string, doctorName: string, time: string, date: Date) {
    const appointmentId = this.generateAppointmentId(date, time, doctorId);
    const appointmentRef = ref(db, `users/${uid}/appointments/${appointmentId}`);
    return set(appointmentRef, {
      // doctorName: doctorName,
      // appointmentTime: time,
      // appointmentDate: date.toISOString(),
      // healthCondition: healthCondition,
      // createdAt: new Date().toISOString()
      key:appointmentId,
      doctor: doctorId,
      date: date.toISOString(),
      time: time,
      status: AppointmentStatus.READY,
    } as Appointment)
      .then(() => {
        console.log("Appointment created successfully.");
        return appointmentId; // Return the new appointment ID
      })
      .catch((error) => {
        console.error("Error creating appointment:", error);
        throw error;
      });
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
    const appointmentRef = ref(db, `users/${uid}/appointments/${appointmentKey}`);
    try {
      // await remove(appointmentRef);
      await update(appointmentRef, { meet: AppointmentStatus.CANCEL });
      console.log("Appointment cancelled successfully.");
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      throw error;
    }
  }
}
export class System {
  doctorList: Doctor[] = [];
  doctorListAvailable = false;
  async getListDoctor(): Promise<Doctor[]> {

    if (this.doctorListAvailable) return this.doctorList;
    const snapShot = await get(ref(db, 'doctors'));
    if (snapShot.exists()) {
      const data = snapShot.val();
      this.doctorList = Object.values(data);
    }
    return this.doctorList;
  }
  getListNumber(): number {
    return this.doctorList.length;
  }
}
//tạo  data structure cho bác sĩ
export class DoctorDataService {
  private doctorID:string;
  private appointmentList:Appointment[]=[];

  constructor(doctorID:string) {
    this.doctorID=doctorID;
    this.fetchDoctorAppointment();
  }
  private async fetchDoctorAppointment()
  {
     const docRef = ref(db, `Doctors/${this.doctorID}/appointments`);
     const snapShot=await get(docRef);
    if (snapShot.exists()) {
      const appointmentsObj = snapShot.val();
      this.appointmentList = Object.keys(appointmentsObj).map((key) => ({
        id: key,
        ...appointmentsObj[key]
      })) as Appointment[];
    }
  }
  public getDoctorAppointment()
  {
    //for doctor view
    return this.appointmentList;
  }
  public async updateDoctorAppointment(appointment: Appointment): Promise<void> {
    try {
      const docRef = ref(db, `Doctors/${this.doctorID}/appointments/${appointment.key}`);
      await update(docRef, appointment);
      console.log("Updated appointment:", appointment);
    } catch (e) {
      console.error(e);
    }
  }
  public async doctorStatistics() {
    try {
      // Reference to the doctor's appointments in Realtime Database
      const docRef = ref(db, `Doctors/${this.doctorID}/appointments`);
      const appointmentsSnap = await get(docRef);

      // Initialize statistics with default values
      const statistics = {
        cancel: 0,
        meeting: 0,
        ready: 0,
        ended: 0,
      };

      if (appointmentsSnap.exists()) {
        const appointments = appointmentsSnap.val();

        Object.keys(appointments).forEach((appointmentId) => {
          const appointment = appointments[appointmentId];
          const state = appointment.AppointmentStatus;
          if (state === AppointmentStatus.CANCEL) statistics.cancel += 1;
          if (state === AppointmentStatus.MEETING) statistics.meeting += 1;
          if (state === AppointmentStatus.READY) statistics.ready += 1;
          if (state === AppointmentStatus.ENDED) statistics.ended += 1;
        });
      } else {
        console.log('No appointments found for this doctor.');
      }
      return statistics;
    } catch (error) {
      console.error('Error fetching doctor statistics:', error);
      return null;  // Handle errors
    }
  }
}
