import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { BehaviorSubject } from 'rxjs';
import { AppointmentStatus } from '../component/enum';
import {onAuthStateChanged} from "@angular/fire/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore, query,
  setDoc,
  updateDoc, where
} from "@angular/fire/firestore";
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
  id:string;
  name: string;
  phoneNumber: string;
  email: string;
  address: string;
  turn: number;
  appointments:AppointmentData[];
}

export interface AppointmentData {
  id: string;
  appointmentDate: string;
  appointmentTime: string;
  doctorName: string;
  doctorID:string;
  userID:string;
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
  private currentUser :User;
  private userDataSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  constructor() {
    this.currentUser={} as User;
    onAuthStateChanged(auth, (user) => {
      if (user!==null) {
        this.fetchUserData(user.uid).then((userData) => {
          this.currentUser=userData;
        });
      } else {
        this.userDataSubject.next(null);
      }
    });
  }
  private async fetchUserData(uid: string): Promise<User> {
    let userData: User={} as User;
    const userRef = doc(db, 'Users',uid);
    try {
      const snapshot = await getDoc(userRef);
      if (snapshot.exists()) {
        userData = snapshot.data() as User;
        userData.appointments=await this.getUserAppointments(null);
      } else {
        console.log("No user data found for email:", uid);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
    return userData;
  }
  getUserData() {
    return this.userDataSubject.asObservable();
  }
  async refreshUserData(uid:string) {
    //trigger update event?

    this.currentUser.id=uid;
    await this.fetchUserData(this.currentUser.id).then((userData) => {
      this.currentUser=userData;
    });
  }
  async getUserAppointments(userID: string|null): Promise<AppointmentData[]> {
    if (this.currentUser === null && userID === null) {
      return [];  // Nothing exists
    }
    if (this.currentUser !== null && userID === null) {
      userID = this.currentUser.id;
    }
    try {
      const appointmentsRef = collection(db, `Users/${userID}/appointments`);
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
  async createAppointment(
    //need to remove
    //debugmode
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
    return this.currentUser ? this.currentUser.id : "";

  }

  public getCurrentUserEmail(): string {
    return this.currentUser?this.currentUser.email : "";
  }

  public getCurrentUserName(): string {
    return this.currentUser?this.currentUser.name : "";
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
    const doctorsRef = collection(db, 'Doctors');
    const querySnapshot = await getDocs(doctorsRef);
    querySnapshot.forEach((doc) => {
      this.doctorList.push(doc.data() as Doctor);
    });
    return this.doctorList;
  }
  async getAllPatients(): Promise<User[]> {
    try {
      const usersRef = collection(db, 'Users');
      const querySnapshot = await getDocs(query(usersRef));
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
  getDoctorListSize(): number {
    return this.doctorList.length;
  }
  async getAvailableAppointments(doctorId:string|null){//null for all available appointment
    let appointmentList:AppointmentData[]=[];
    if(doctorId===null)
    {
      const docRef=collection(db,'AvailableAppointments');
      await getDocs(docRef).then((docs)=>{
        docs.forEach((doc) => {
          appointmentList.push(doc.data() as AppointmentData);
        })
      })
    }else
    {
      const docRef=collection(db,'AvailableAppointments');
      const q=query(docRef,where("doctorID","==",doctorId));
      await getDocs(q).then((docs)=>{
        docs.forEach((doc) => {
          appointmentList.push(doc.data() as AppointmentData);
        })
      })
    }
    return appointmentList;
  }
}
export class DoctorDataService { //always call for initialize
  private doctorID: string="";
  private doctorAppointmentList: AppointmentData[] = [];
  appointmentDataService = new AppointmentDataService();
  constructor(doctorID: string) {
    //consider call initialize, or else this code will fail
    this.doctorID = doctorID;
    this.fetchDoctorAppointment();
  }
  async initialize()
  {
    await this.fetchDoctorAppointment();
  }
  private async fetchDoctorAppointment() {
    const docRef = collection(db, `Doctors/${this.doctorID}/appointments`);
    await getDocs(docRef).then((data)=>{
      data.forEach((doc) => {
        this.doctorAppointmentList.push({id:doc.id,...doc.data()} as AppointmentData);
      })
    })
  }
  public getDoctorAppointment() {
    return this.doctorAppointmentList;
  }
  public async updateDoctorAppointment(appointment: AppointmentData): Promise<void> {
    await this.appointmentDataService.updateReservedAppointment(appointment);
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
        preserved:0,
      };
      if (!appointmentsSnap.empty) {
        const appointments = appointmentsSnap.docs.map(doc => doc.data());
        return appointments.forEach((appointment) => {
          const state = appointment['status'];
          if (state === AppointmentStatus.CANCEL) statistics.cancel += 1;
          if (state === AppointmentStatus.MEETING) statistics.meeting += 1;
          if (state === AppointmentStatus.READY) statistics.ready += 1;
          if (state === AppointmentStatus.ENDED) statistics.ended += 1;
          if(state===AppointmentStatus.PRESERVED) statistics.preserved+=1;
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
export class UserInitialize{
 currentUser: User;
  constructor(currentUser: User) {
    this.currentUser=currentUser;
  }
  updateUser(user: Partial<User>) {
    this.currentUser={...this.currentUser,...user};
  }
  async isThisUserExist() {
    const refUser = doc(db, `Users/${this.currentUser.email}`);

    const snapShot = await getDoc(refUser);
    return !!snapShot.exists();
  }
  async pushUser() {
    if (this.currentUser !== null && !await this.isThisUserExist()) {
      const refUser = doc(db, `Users/${this.currentUser.email}`);
      await setDoc(refUser, this.currentUser);
      return true;
    }
    return false;
  }
}
export class AppointmentDataService
{
  //
  public async createBlankAppointment(appointment: AppointmentData) {//return appointmentID
    const docRef = doc(db, "AvailableAppointments");

    await setDoc(docRef, appointment).then(()=>{
      appointment.id =docRef.id;
    })
      .catch(e => console.error(e));
    return appointment;
  }
  public async updateAvailableAppointment(appointment: Partial<AppointmentData>) {
    if (!appointment.id) {
      console.error("Appointment ID is required to update the document");
      return;
    }
    try {
      await updateDoc(doc(db, "AvailableAppointments", appointment.id), appointment);
      console.log("Appointment updated successfully!");
    } catch (error) {
      console.error("Error updating appointment: ", error);
    }
  }
  async checkAppointmentStats(appointment: AppointmentData) {
    const appointmentDocRef = doc(db, "AvailableAppointments", appointment.id);
    const appointmentSnap = await getDoc(appointmentDocRef);
    if (!appointmentSnap.exists()) {
      console.error("Appointment does not exist.");
      return false;
    }
    const userDocRef = doc(db, "Users", appointment.userID);
    const userSnap = await getDoc(userDocRef);
    if (!userSnap.exists()) {
      console.error("User does not exist.");
      return false;
    }
    const doctorDocRef = doc(db, "Doctors", appointment.doctorID);
    const doctorSnap = await getDoc(doctorDocRef);
    if (!doctorSnap.exists()) {
      console.error("Doctor does not exist.");
      return false;
    }
    return true;
  }
  public async reserveAppointment(appointment: AppointmentData) {
    try {
      if(!await this.checkAppointmentStats(appointment)) return;
      const userAppointmentsRef = doc(db, "Users", appointment.userID, "appointments", appointment.id);
      const doctorAppointmentsRef = doc(db, "Doctors", appointment.doctorID, "appointments", appointment.id);
      await setDoc(userAppointmentsRef, appointment);
      console.log("Appointment added to user's appointments.");
      await setDoc(doctorAppointmentsRef, appointment);
      console.log("Appointment added to doctor's appointments.");
      await deleteDoc(doc(db, "AvailableAppointments", appointment.id));
    } catch (error) {
      console.error("Error reserving appointment: ", error);
    }
  }
  async updateReservedAppointment(appointment: AppointmentData) {//update only 3 fields
    try {
      const userAppointmentsRef = doc(db, "Users", appointment.userID, "appointments", appointment.id);
      const doctorAppointmentsRef = doc(db, "Doctors", appointment.doctorID, "appointments", appointment.id);
      const userDocSnap = await getDoc(userAppointmentsRef);
      if (!userDocSnap.exists()) {
        console.error("Appointment not found in user's appointments.");
        return;
      }
      const doctorDocSnap = await getDoc(doctorAppointmentsRef);
      if (!doctorDocSnap.exists()) {
        console.error("Appointment not found in doctor's appointments.");
        return;
      }
      const updateField:Partial<AppointmentData> ={
        healthCondition:appointment.healthCondition,
        status:appointment.status,
        comment:appointment.comment,
      }
      await updateDoc(userAppointmentsRef, updateField);
      console.log("Appointment updated in user's appointments.");

      await updateDoc(doctorAppointmentsRef, updateField);
      console.log("Appointment updated in doctor's appointments.");
    } catch (error) {
      console.error("Error updating appointment: ", error);
    }
  }
}


