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
    filter: Date
}

const initialState: DoctorHandleState = {
    total_appointment: 0,
    appointments: [],
    is_meeting: false,
    filter: new Date()
};

@Injectable({
    providedIn: 'root'
})
export class DoctorAppointmentHistoryStore {
    private store: ComponentStore<DoctorHandleState>;
    private initialized = false;
    readonly total_appointments$: Observable<number>;
    readonly is_meeting$: Observable<boolean>;
    readonly appointments$: Observable<DoctorAppointment[]>;
    readonly filter$: Observable<Date>;
    constructor(
        private system: System,
        private doctorStore: DoctorDataService) {
        this.initialize();
        this.store = ComponentStore.getInstance<DoctorHandleState>(initialState);
        this.filter$ = this.store.select(s => s.filter);
        this.total_appointments$ = this.store.select(state => state.total_appointment);
        this.is_meeting$ = this.store.select(state => state.is_meeting);
        this.appointments$ = this.store.select(state => state.appointments);
    }

    private async initialize() {
        if (!this.initialized) {
            this.initialized = true;
            this.filter$.subscribe(filter => {
                this.setData(filter);
            });
        }

    }

    setFilter(value: Date) {
        this.store.patchState({ filter: value });
    }

    async setData(filter: Date) {
        const data: DoctorAppointment[] = await this.doctorStore.getAppointmentsHistory(filter);
        this.store.patchState({ appointments: data });
    }

    setIsMeeting(value: boolean) {
        this.store.patchState({ is_meeting: value });
    }
}