import { Injectable } from "@angular/core";
import { ComponentStore } from "../../component/store.cp";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { combineLatest } from "rxjs";
import { UserDataService } from "../../data/data";


export interface PageState {
  role: string;
  bluredHeader: boolean;
  bluredContent: boolean;
  bluredSlider: boolean;
  turn: number; 
}

const initialState: PageState = {
  role: '',
  bluredHeader: false,
  bluredContent: false,
  bluredSlider: false,
  turn: 0,
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
  readonly turn$: Observable<number>;

  constructor(
    private data: UserDataService
  ) {
    this.store = ComponentStore.getInstance<PageState>(initialState);
    this.role$ = this.store.select(s => s.role);
    this.bluredHeader$ = this.store.select(s => s.bluredHeader);
    this.bluredContent$ = this.store.select(s => s.bluredContent);
    this.bluredSlider$ = this.store.select(s => s.bluredSlider);
    this.role = this.role.bind(this);
    this.turn$ = this.store.select(s => s.turn);
    this.initialize();
  }

  private async initialize() {
    if (!this.initialized) {
      this.initialized = true;
      await this.setTurn();
    }
  }

  
  async setTurn() {
    const value = await this.data.getTurn();
    this.store.patchState({turn: value})
  }

  role = (): string => {
    const value = this.store.get().role;
    return value;
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