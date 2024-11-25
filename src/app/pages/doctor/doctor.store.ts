import { Injectable } from "@angular/core";
import { Doctor, System } from "../../../data/data";
import { ComponentStore } from "../../../component/store.cp";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { combineLatest } from "rxjs";

export interface DoctorState {
    filter_tag: string;
    filter_search: string;
    search_data: string;
    data: Doctor[];
    is_modal: boolean;
    modal_value: Doctor
    total_doctors: number;
    initial_tag: string;
}

const initialState: DoctorState = {
    total_doctors: 0,
    filter_tag: 'all',
    filter_search: '',
    search_data: '',
    data: [],
    is_modal: false,
    modal_value: {
        name: '',
        specialization: '',
        tag: '',
        imageUrl: ''
    },
    initial_tag: 'all',
};

@Injectable({
    providedIn: 'root'
})
export class DoctorStore {
    private store: ComponentStore<DoctorState>;
    private initialized = false;
    readonly modal_value$: Observable<Doctor>
    readonly initial_tag$: Observable<string>;
    readonly total_doctors$: Observable<number>;
    readonly data$: Observable<Doctor[]>;
    readonly filter_tag$: Observable<string>;
    readonly filter_search$: Observable<string>;
    readonly search_data$: Observable<string>;
    readonly is_modal$: Observable<boolean>;
    readonly filteredDoctors$: Observable<Doctor[]>;


    constructor(private system: System) {
        this.store = ComponentStore.getInstance<DoctorState>(initialState);
        this.initial_tag$ = this.store.select(s => s.initial_tag);
        this.total_doctors$ = this.store.select(s => s.total_doctors);
        this.data$ = this.store.select(state => state.data);
        this.filter_tag$ = this.store.select(state => state.filter_tag);
        this.filter_search$ = this.store.select(state => state.filter_search);
        this.search_data$ = this.store.select(state => state.search_data);
        this.is_modal$ = this.store.select(state => state.is_modal);
        this.modal_value$ = this.store.select(state => state.modal_value);

        this.filteredDoctors$ = combineLatest([this.data$, this.filter_tag$, this.filter_search$]).pipe(
            map(([doctors, tag, search]) =>
                doctors.filter(doctor => {
                    const nameMatch = !search || !doctor?.name
                        ? true
                        : doctor.name.toLowerCase().includes(search.toLowerCase());
                    const tagMatch = tag === 'all' || doctor?.tag === tag;
                    return nameMatch && tagMatch;
                })
            )
        );
        this.initialize();
    }

    private initialize() {
        if (!this.initialized) {
            this.setData();
            this.setTotal(0);
            this.initialized = true;
        }
    }

    setModalValue(value: Doctor) {
        this.store.patchState({ modal_value: value})
    }

    setTotal(res: number) {
        const total_doctors = res !== 0 ? this.system.getListNumber() : res;
        this.store.patchState({ total_doctors });
    }

    setInitialTag(value: string) {
        this.store.patchState({ initial_tag: value });
    }

    setData() {
        const data: Doctor[] = this.system.getListDoctor();
        this.store.patchState({ data });
    }

    setFiltersTag(filter_tag: string) {
        this.store.patchState({ filter_tag });
    }

    setFiltersSearch(filter_search: string) {
        this.store.patchState({ filter_search });
    }

    setSearchData(search_data: string) {
        this.store.patchState({ search_data });
    }

    setIsModal(is_modal: boolean) {
        this.store.patchState({ is_modal });
    }
}