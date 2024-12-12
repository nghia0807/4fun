import { Injectable } from "@angular/core";
import { Appointment, Appointmentvalue, DoctorAppointment, System, UserAppointment } from "../../../data/data";
import { DoctorDataService } from "../../../data/doctor.service";
import { ComponentStore } from "../../../component/store.cp";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { combineLatest } from "rxjs";
import { AppointmentStatus } from "../../../component/enum";

export interface DoctorHandleState {
    total_appointment: number;
    appointments: DoctorAppointment[];
    is_meeting: boolean;
    filter: Date;
    filterId: string;
}

const initialState: DoctorHandleState = {
    total_appointment: 0,
    appointments: [],
    is_meeting: false,
    filter: new Date(),
    filterId: '',
};

@Injectable({
    providedIn: 'root'
})
export class DoctorAppointmentHistoryStore {
    private store: ComponentStore<DoctorHandleState>;
    
    readonly total_appointments$: Observable<number>;
    readonly is_meeting$: Observable<boolean>;
    readonly appointments$: Observable<DoctorAppointment[]>;
    readonly filter$: Observable<Date>;
    readonly filterId$: Observable<string>;
    
    constructor(
        private system: System,
        private doctorStore: DoctorDataService
    ) {
        this.store = ComponentStore.getInstance<DoctorHandleState>(initialState);
        
        this.filter$ = this.store.select(s => s.filter);
        this.filterId$ = this.store.select(s => s.filterId);
        this.total_appointments$ = this.store.select(state => state.total_appointment);
        this.is_meeting$ = this.store.select(state => state.is_meeting);
        
        // Create a filtered appointments observable
        this.appointments$ = this.store.select(state => {
            const appointments = state.appointments;
            const filterId = state.filterId;
            return this.filterAppointments(appointments, filterId);
        });

        // Initial data fetch
        this.setData();
    }

    private filterAppointments(appointments: DoctorAppointment[], filterId: string): DoctorAppointment[] {
        if (!filterId) return appointments;
        const lowerCaseFilterId = filterId.toLowerCase(); // Chuyển về chữ thường để tìm kiếm không phân biệt hoa thường
        return appointments.filter(appointment => 
            appointment.id.toLowerCase().includes(lowerCaseFilterId)
        );
    }
    

    setFilterId(value: string) {
        this.store.patchState({ filterId: value });
    }

    setFilter(value: Date) {
        this.store.patchState({ filter: value });
    }

    async setData() {
        try {
            const data: DoctorAppointment[] = await this.doctorStore.getAppointmentsHistory();
            this.store.patchState({ appointments: data });
        } catch (error) {
            console.error('Error fetching appointments:', error);
        }
    }

    setIsMeeting(value: boolean) {
        this.store.patchState({ is_meeting: value });
    }
}