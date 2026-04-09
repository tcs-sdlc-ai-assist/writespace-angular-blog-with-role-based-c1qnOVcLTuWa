import { Injectable } from '@angular/core';
import { SessionService } from './session.service';
import { UserService } from './user.service';
import type { Session, User } from '../models';
import { ADMIN_CREDENTIALS } from '../models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(
    private sessionService: SessionService,
    private userService: UserService
  ) {}

  login(username: string, password: string): boolean {
    if (
      username === ADMIN_CREDENTIALS.username &&
      password === ADMIN_CREDENTIALS.password
    ) {
      const session: Session = {
        userId: ADMIN_CREDENTIALS.id,
        username: ADMIN_CREDENTIALS.username,
        displayName: ADMIN_CREDENTIALS.displayName,
        role: ADMIN_CREDENTIALS.role,
      };
      this.sessionService.saveSession(session);
      return true;
    }

    const user: User | null = this.userService.getUserByUsername(username);
    if (!user) {
      return false;
    }

    if (user.password !== password) {
      return false;
    }

    const session: Session = {
      userId: user.id,
      username: user.username,
      displayName: user.displayName,
      role: user.role,
    };
    this.sessionService.saveSession(session);
    return true;
  }

  register(displayName: string, username: string, password: string): boolean {
    const id = 'user-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 9);

    const newUser: User = {
      id,
      displayName,
      username,
      password,
      role: 'user',
    };

    const created = this.userService.createUser(newUser);
    if (!created) {
      return false;
    }

    const session: Session = {
      userId: newUser.id,
      username: newUser.username,
      displayName: newUser.displayName,
      role: newUser.role,
    };
    this.sessionService.saveSession(session);
    return true;
  }

  logout(): void {
    this.sessionService.clearSession();
  }

  isAuthenticated(): boolean {
    return this.sessionService.getSession() !== null;
  }

  isAdmin(): boolean {
    const session = this.sessionService.getSession();
    if (!session) {
      return false;
    }
    return session.role === 'admin';
  }

  getCurrentUser(): Session | null {
    return this.sessionService.getSession();
  }
}