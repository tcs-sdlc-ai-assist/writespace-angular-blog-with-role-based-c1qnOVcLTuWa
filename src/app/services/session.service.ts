import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import type { Session } from '../models';
import { SESSION_KEY } from '../models';
import { LocalStorageService } from './local-storage.service';

@Injectable({ providedIn: 'root' })
export class SessionService {
  private sessionSubject: BehaviorSubject<Session | null>;

  readonly session$ = this.sessionSubject?.asObservable();

  constructor(private localStorageService: LocalStorageService) {
    const stored = this.localStorageService.getItem<Session>(SESSION_KEY);
    this.sessionSubject = new BehaviorSubject<Session | null>(stored);
    this.session$ = this.sessionSubject.asObservable();
  }

  saveSession(session: Session): void {
    this.localStorageService.setItem(SESSION_KEY, session);
    this.sessionSubject.next(session);
  }

  clearSession(): void {
    this.localStorageService.removeItem(SESSION_KEY);
    this.sessionSubject.next(null);
  }

  getSession(): Session | null {
    return this.sessionSubject.getValue();
  }
}