import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import type { User } from '../models';
import { USERS_KEY, ADMIN_CREDENTIALS } from '../models';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private localStorageService: LocalStorageService) {}

  getAllUsers(): User[] {
    const storedUsers = this.localStorageService.getItem<User[]>(USERS_KEY) ?? [];
    const hasAdmin = storedUsers.some(
      (u) => u.id === ADMIN_CREDENTIALS.id || u.username === ADMIN_CREDENTIALS.username
    );
    if (hasAdmin) {
      return storedUsers;
    }
    return [{ ...ADMIN_CREDENTIALS }, ...storedUsers];
  }

  getUserByUsername(username: string): User | null {
    if (username === ADMIN_CREDENTIALS.username) {
      const storedUsers = this.localStorageService.getItem<User[]>(USERS_KEY) ?? [];
      const storedAdmin = storedUsers.find((u) => u.username === ADMIN_CREDENTIALS.username);
      return storedAdmin ?? { ...ADMIN_CREDENTIALS };
    }
    const storedUsers = this.localStorageService.getItem<User[]>(USERS_KEY) ?? [];
    const found = storedUsers.find((u) => u.username === username);
    return found ?? null;
  }

  createUser(user: User): boolean {
    const allUsers = this.getAllUsers();
    const usernameTaken = allUsers.some(
      (u) => u.username.toLowerCase() === user.username.toLowerCase()
    );
    if (usernameTaken) {
      return false;
    }
    const storedUsers = this.localStorageService.getItem<User[]>(USERS_KEY) ?? [];
    storedUsers.push(user);
    this.localStorageService.setItem(USERS_KEY, storedUsers);
    return true;
  }

  deleteUser(id: string): boolean {
    if (id === ADMIN_CREDENTIALS.id) {
      return false;
    }
    const storedUsers = this.localStorageService.getItem<User[]>(USERS_KEY) ?? [];
    const index = storedUsers.findIndex((u) => u.id === id);
    if (index === -1) {
      return false;
    }
    storedUsers.splice(index, 1);
    this.localStorageService.setItem(USERS_KEY, storedUsers);
    return true;
  }
}