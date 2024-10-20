import { Observable, BehaviorSubject } from 'rxjs';
import { Injectable, OnDestroy, Inject, Optional, InjectionToken } from '@angular/core';

export const COMPONENT_STORE_DEFAULT_STATE = new InjectionToken<object>('COMPONENT_STORE_DEFAULT_STATE');

@Injectable({ providedIn: 'root' })
export class ComponentStore<T extends object> implements OnDestroy {
  private static instance: ComponentStore<any>;
  private readonly stateSubject$: BehaviorSubject<T>;
  readonly state$: Observable<T>;

  private constructor(@Optional() @Inject(COMPONENT_STORE_DEFAULT_STATE) defaultState?: T) {
    this.stateSubject$ = new BehaviorSubject<T>(defaultState || {} as T);
    this.state$ = this.stateSubject$.asObservable();
  }

  static getInstance<T extends object>(@Optional() @Inject(COMPONENT_STORE_DEFAULT_STATE) defaultState?: T): ComponentStore<T> {
    if (!ComponentStore.instance) {
      ComponentStore.instance = new ComponentStore<T>(defaultState);
    }
    return ComponentStore.instance as ComponentStore<T>;
  }

  ngOnDestroy(): void {
    this.stateSubject$.complete();
  }

  setState(stateOrUpdaterFn: T | ((state: T) => T)): void {
    const currentState = this.stateSubject$.getValue();
    const newState = typeof stateOrUpdaterFn === 'function'
      ? (stateOrUpdaterFn as (state: T) => T)(currentState)
      : stateOrUpdaterFn;
    this.stateSubject$.next(newState);
  }

  patchState(partialState: Partial<T>): void {
    const currentState = this.stateSubject$.getValue();
    this.stateSubject$.next({ ...currentState, ...partialState });
  }

  select<R>(projector: (state: T) => R): Observable<R> {
    return new Observable<R>(observer => {
      return this.state$.subscribe(state => {
        observer.next(projector(state));
      });
    });
  }

  get(): T {
    return this.stateSubject$.getValue();
  }
}