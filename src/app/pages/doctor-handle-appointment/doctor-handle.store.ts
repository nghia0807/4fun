import { Injectable } from "@angular/core";
import { AppointmentValue, System, UserAppointment } from "../../../data/data";
import { ComponentStore } from "../../../component/store.cp";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { combineLatest } from "rxjs";
import { AppointmentStatus } from "../../../component/enum";

export interface DoctorHandleState {
   total_appointment: number;
   appointments: UserAppointment[];
   is_meeting: boolean;
   meeting_value: AppointmentValue;
}

const initialState: DoctorHandleState = {
    total_appointment: 0,
    appointments: [],
    is_meeting: false,
    meeting_value: {
        id: 0,
        patientName: 'test',
        address: 'test',
        birth: new Date(),
        comment: 'test',
        appointmentDate: new Date()
    }
};

@Injectable({
    providedIn: 'root'
})
export class DoctorHandleStore {
    private store: ComponentStore<DoctorHandleState>;
    private initialized = false;
    readonly total_appointments$: Observable<number>;
    readonly is_meeting$: Observable<boolean>;
    readonly appointments$: Observable<UserAppointment[]>;
    readonly meeting_value$: Observable<AppointmentValue>;

    constructor(private system: System) {
        this.store = ComponentStore.getInstance<DoctorHandleState>(initialState);
        this.total_appointments$ = this.store.select(state => state.total_appointment);
        this.is_meeting$ = this.store.select(state => state.is_meeting);
        this.meeting_value$ = this.store.select(state => state.meeting_value);
        this.appointments$ = this.store.select(state => state.appointments);
        this.initialize();
    }

    private initialize() {
        if (!this.initialized) {
            this.initialized = true;
        }
    }

    setIsMeeting(value: boolean) {
        this.store.patchState({is_meeting: value});
    }

    setMeetingValue(value: AppointmentValue) {
        this.store.patchState({ meeting_value: value});
    }
}
