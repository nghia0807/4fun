import { Injectable } from '@angular/core';
import { ref, get, getDatabase, update } from "firebase/database";
import { Appointment, Appointmentvalue, DoctorAppointment, UserDataService } from './data';
import { AppointmentStatus } from '../component/enum'; // Adjust the import path as needed
const db = getDatabase();
export interface AppointmentStatusData {
  status: AppointmentStatus;
  count: number;
}
@Injectable({
  providedIn: 'root' // or 'any' depending on your dependency injection strategy
})
export class DoctorDataService {
  private doctorId = '';

  constructor(private user: UserDataService) {
    this.user.getUserData().subscribe(userData => {
      if (userData) {
        // Assuming the doctor ID is stored in the user data
        this.doctorId = userData.id || '';
      }
    });
  }

  async getAppointmentDetail(id: string): Promise<Appointmentvalue> {
    const appointmentsRef = ref(db, `appointments/${id}`);
    const usersRef = ref(db, `users`);

    try {
      const [appointmentSnapshot, usersSnapshot] = await Promise.all([
        get(appointmentsRef),
        get(usersRef)
      ]);

      // If no appointment found, return default empty object
      if (!appointmentSnapshot.exists()) {
        return {
          id: '',
          patientName: '',
          address: '',
          birth: new Date(),
          comment: '',
          appointmentDate: new Date()
        };
      }

      const appointmentData = appointmentSnapshot.val();
      const userData = usersSnapshot.val();

      // Find patient details
      const patientData = userData[appointmentData.uid] || {};

      return {
        id: id,
        patientName: patientData.name || 'Unknown Patient',
        address: patientData.address || '',
        birth: new Date(), // Note: birth date is not in the current data structure
        comment: appointmentData.healthCondition || '',
        appointmentDate: new Date(appointmentData.appointmentDate),
      };
    } catch (error) {
      console.error('Error fetching appointment details:', error);

      // Return an empty or default Appointmentvalue object
      return {
        id: '',
        patientName: '',
        address: '',
        birth: new Date(),
        comment: '',
        appointmentDate: new Date()
      };
    }
  }

  async getAppointments(filterMonth?: Date): Promise<DoctorAppointment[]> {
    const uid = this.doctorId;
    const usersRef = ref(db, `users`);
    const appointmentsRef = ref(db, `appointments`);

    try {
      const snapshot = await get(appointmentsRef);
      const userShot = await get(usersRef);
      if (!snapshot.exists() && !userShot.exists()) return [];
      const userData = userShot.val() || {};

      return Object.entries(snapshot.val() || {})
        .filter(([_, appointmentData]: [string, any]) => {
          // Check doctor ID
          const isCorrectDoctor = appointmentData.doctorId === uid;

          // Check status exclusion
          const isValidStatus = appointmentData.status !== 'ENDING' && appointmentData.status !== 'CANCEL';

          // Check month filter if provided
          const appointmentDate = new Date(appointmentData.appointmentDate);
          const isCorrectMonth = !filterMonth || (
            appointmentDate.getFullYear() === filterMonth.getFullYear() &&
            appointmentDate.getMonth() === filterMonth.getMonth()
          );

          return isCorrectDoctor && isValidStatus && isCorrectMonth;
        })
        .map(([key, appointmentData]: [string, any]) => {
          const patientName = userData[appointmentData.uid]?.name || 'Unknown Patient';
          return {
            id: key,
            patientName: patientName,
            date: new Date(appointmentData.appointmentDate),
            time: appointmentData.appointmentTime,
            status: appointmentData.status
          };
        });
    } catch (error) {
      console.error("Error fetching appointments:", error);
      return [];
    }
  }
  async getAppointmentsHistory(filterMonth?: Date): Promise<DoctorAppointment[]> {
    const uid = this.doctorId;
    const usersRef = ref(db, `users`);
    const appointmentsRef = ref(db, `appointments`);
  
    try {
      const snapshot = await get(appointmentsRef);
      const userShot = await get(usersRef);
      
      // Early return if no data exists
      if (!snapshot.exists() && !userShot.exists()) return [];
      
      const userData = userShot.val() || {};
      const appointmentsData = snapshot.val() || {};
  
      return Object.entries(appointmentsData)
        .filter(([_, appointmentData]: [string, any]) => {
          // Strict checks for doctor and status
          const isCorrectDoctor = appointmentData.doctorId === uid;
          const isValidStatus = appointmentData.status !== 'READY';
  
          // Enhanced month filtering with more robust date handling
          const appointmentDate = new Date(appointmentData.appointmentDate);
          const isCorrectMonth = !filterMonth || (
            appointmentDate.getFullYear() === filterMonth.getFullYear() &&
            appointmentDate.getMonth() === filterMonth.getMonth()
          );
  
          // Combine all filtering conditions
          return isCorrectDoctor && 
                 isValidStatus && 
                 isCorrectMonth;
        })
        .map(([key, appointmentData]: [string, any]) => {
          const patientName = userData[appointmentData.uid]?.name || 'Unknown Patient';
          
          return {
            id: key,
            patientName: patientName,
            date: new Date(appointmentData.appointmentDate),
            time: appointmentData.appointmentTime,
            status: appointmentData.status
          };
        });
    } catch (error) {
      console.error("Error fetching appointments history:", error);
      return [];
    }
  }

  async cancelAppointment(appointmentKey: string): Promise<void> {
    const appointmentRef = ref(db, `appointments/${appointmentKey}`);
    try {
      await update(appointmentRef, {
        status: AppointmentStatus.CANCEL
      });
    } catch (error) {
      throw error;
    }
  }
  async EndingAppointment(appointmentKey: string): Promise<void> {
    const appointmentRef = ref(db, `appointments/${appointmentKey}`);
    try {
      await update(appointmentRef, {
        status: AppointmentStatus.ENDING
      });
    } catch (error) {
      throw error;
    }
  }

  async getAppointmentStatusCount(
    doctorId?: string,
    filterMonth?: Date
  ): Promise<AppointmentStatusData[]> {
    // Use provided doctorId or fallback to the stored doctorId
    const uid = doctorId || this.doctorId;

    // If no doctorId is available, return empty array
    if (!uid) {
      console.warn('No doctor ID provided');
      return [];
    }

    const appointmentsRef = ref(db, `appointments`);

    try {
      const snapshot = await get(appointmentsRef);
      if (!snapshot.exists()) return [];

      // Initialize count object
      const statusCounts = {
        [AppointmentStatus.CANCEL]: 0,
        [AppointmentStatus.READY]: 0,
        [AppointmentStatus.ENDING]: 0
      };

      // Count appointments for the specific doctor
      Object.values(snapshot.val() || {}).forEach((appointment: any) => {
        // Check doctor ID
        const isCorrectDoctor = appointment.doctorId === uid;

        // Check month if filterMonth is provided
        const appointmentDate = new Date(appointment.appointmentDate);
        const isCorrectMonth = !filterMonth || (
          appointmentDate.getFullYear() === filterMonth.getFullYear() &&
          appointmentDate.getMonth() === filterMonth.getMonth()
        );

        // Count if both conditions are met
        if (isCorrectDoctor && isCorrectMonth &&
          appointment.status in statusCounts) {
          statusCounts[appointment.status as AppointmentStatus]++;
        }
      });

      // Convert to array format matching the requested structure
      return Object.entries(statusCounts).map(([status, count]) => ({
        status: status as AppointmentStatus,
        count
      })).filter(item => item.count > 0);
    } catch (error) {
      console.error("Error fetching appointment status counts:", error);
      return [];
    }
  }
}