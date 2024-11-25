import { Injectable } from "@angular/core";
import { ComponentStore } from "../../component/store.cp";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { combineLatest } from "rxjs";
import { System } from "../../data/data";

export interface PageState {
  role: string;
  bluredHeader: boolean;
  bluredContent: boolean;
  bluredSlider: boolean;
}

const initialState: PageState = {
  role: '',
  bluredHeader: false,
  bluredContent: false,
  bluredSlider: false,
};

@Injectable({
  providedIn: 'root'
})
export class MainStore {
  private store: ComponentStore<PageState>;
  private initialized = false;
  readonly role$: Observable<string>;
  readonly bluredHeader$: Observable<boolean>;
  readonly bluredSlider$: Observable<boolean>;
  readonly bluredContent$: Observable<boolean>;

  constructor(private system: System) {
    this.store = ComponentStore.getInstance<PageState>(initialState);
    this.role$ = this.store.select(s => s.role);
    this.bluredHeader$ = this.store.select(s => s.bluredHeader);
    this.bluredContent$ = this.store.select(s => s.bluredContent);
    this.bluredSlider$ = this.store.select(s => s.bluredSlider);

    this.initialize();
  }

  private initialize() {
    if (!this.initialized) {
      this.initialized = true;
    }
  }

  setBluredHeader(value: boolean) {
    this.store.patchState({ bluredHeader: value });
  }
  setBluredContent(value: boolean) {
    this.store.patchState({ bluredContent: value });
  }

  setBluredSlider(value: boolean) {
    this.store.patchState({ bluredSlider: value });
  }

  setRole(value: string) {
    this.store.patchState({ role: value });
  }

}