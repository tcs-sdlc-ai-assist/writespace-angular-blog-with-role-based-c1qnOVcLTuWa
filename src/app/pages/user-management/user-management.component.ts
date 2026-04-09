import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AvatarComponent } from '../../components/avatar/avatar.component';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import type { User, Role, Session } from '../../models';
import { ADMIN_CREDENTIALS } from '../../models';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule, AvatarComponent],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css'],
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  currentSession: Session | null = null;

  showCreateForm = false;

  newDisplayName = '';
  newUsername = '';
  newPassword = '';
  newRole: Role = 'user';

  formSubmitted = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentSession = this.authService.getCurrentUser();
    this.loadUsers();
  }

  loadUsers(): void {
    this.users = this.userService.getAllUsers();
  }

  toggleCreateForm(): void {
    this.showCreateForm = !this.showCreateForm;
    if (!this.showCreateForm) {
      this.resetForm();
    }
  }

  resetForm(): void {
    this.newDisplayName = '';
    this.newUsername = '';
    this.newPassword = '';
    this.newRole = 'user';
    this.formSubmitted = false;
    this.errorMessage = '';
    this.successMessage = '';
  }

  get isDisplayNameValid(): boolean {
    return this.newDisplayName.trim().length >= 2;
  }

  get isUsernameValid(): boolean {
    return this.newUsername.trim().length >= 3;
  }

  get isPasswordValid(): boolean {
    return this.newPassword.length >= 6;
  }

  get isFormValid(): boolean {
    return this.isDisplayNameValid && this.isUsernameValid && this.isPasswordValid;
  }

  onCreateUser(): void {
    this.formSubmitted = true;
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.isFormValid) {
      return;
    }

    const existingUser = this.userService.getUserByUsername(this.newUsername.trim());
    if (existingUser) {
      this.errorMessage = 'Username is already taken. Please choose a different one.';
      return;
    }

    const id = 'user-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 9);

    const newUser: User = {
      id,
      displayName: this.newDisplayName.trim(),
      username: this.newUsername.trim(),
      password: this.newPassword,
      role: this.newRole,
    };

    const created = this.userService.createUser(newUser);
    if (!created) {
      this.errorMessage = 'Failed to create user. Username may already exist.';
      return;
    }

    this.successMessage = `User "${newUser.displayName}" created successfully.`;
    this.loadUsers();
    this.resetForm();
    this.showCreateForm = false;
  }

  cancelCreate(): void {
    this.showCreateForm = false;
    this.resetForm();
  }

  isDeleteDisabled(user: User): boolean {
    if (user.id === ADMIN_CREDENTIALS.id || user.username === ADMIN_CREDENTIALS.username) {
      return true;
    }
    if (this.currentSession && user.id === this.currentSession.userId) {
      return true;
    }
    return false;
  }

  getDeleteTooltip(user: User): string {
    if (user.id === ADMIN_CREDENTIALS.id || user.username === ADMIN_CREDENTIALS.username) {
      return 'Cannot delete the default admin';
    }
    if (this.currentSession && user.id === this.currentSession.userId) {
      return 'Cannot delete yourself';
    }
    return 'Delete user';
  }

  onDeleteUser(user: User): void {
    if (this.isDeleteDisabled(user)) {
      return;
    }

    const confirmed = confirm(`Are you sure you want to delete user "${user.displayName}"? This action cannot be undone.`);
    if (!confirmed) {
      return;
    }

    const deleted = this.userService.deleteUser(user.id);
    if (deleted) {
      this.successMessage = `User "${user.displayName}" has been deleted.`;
      this.errorMessage = '';
      this.loadUsers();
    } else {
      this.errorMessage = `Failed to delete user "${user.displayName}".`;
      this.successMessage = '';
    }
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map((part) => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }
}
```

Wait, I need to also create the template file since the component references `templateUrl: './user-management.component.html'`. But the task only asks for the `.ts` file. Let me check — the task says to generate `src/app/pages/user-management/user-management.component.ts`. The CSS file already exists. But the HTML template doesn't exist yet, and the component references it via `templateUrl`.

I should use an inline template instead to avoid a missing file error. Let me revise:

```typescript
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AvatarComponent } from '../../components/avatar/avatar.component';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import type { User, Role, Session } from '../../models';
import { ADMIN_CREDENTIALS } from '../../models';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule, AvatarComponent],
  template: `
    <div class="admin-user-management">
      <div class="page-header">
        <h1>User Management</h1>
        <button class="btn-create" (click)="toggleCreateForm()">
          <span class="btn-icon">{{ showCreateForm ? '✕' : '+' }}</span>
          {{ showCreateForm ? 'Cancel' : 'Create User' }}
        </button>
      </div>

      <div *ngIf="successMessage" class="alert-success-banner">
        {{ successMessage }}
      </div>

      <div *ngIf="errorMessage" class="error-banner">
        ⚠ {{ errorMessage }}
      </div>

      <!-- Create User Form -->
      <div *ngIf="showCreateForm" class="create-user-form-container">
        <h2>Create New User</h2>
        <form (ngSubmit)="onCreateUser()" novalidate>
          <div class="form-grid">
            <div class="form-group">
              <label for="displayName">Display Name</label>
              <input
                type="text"
                id="displayName"
                [(ngModel)]="newDisplayName"
                name="displayName"
                placeholder="Enter display name"
                [class.ng-invalid]="formSubmitted && !isDisplayNameValid"
                [class.ng-touched]="formSubmitted"
              />
              <span *ngIf="formSubmitted && !isDisplayNameValid" class="error-message">
                Display name must be at least 2 characters.
              </span>
            </div>

            <div class="form-group">
              <label for="username">Username</label>
              <input
                type="text"
                id="username"
                [(ngModel)]="newUsername"
                name="username"
                placeholder="Enter username"
                [class.ng-invalid]="formSubmitted && !isUsernameValid"
                [class.ng-touched]="formSubmitted"
              />
              <span *ngIf="formSubmitted && !isUsernameValid" class="error-message">
                Username must be at least 3 characters.
              </span>
            </div>

            <div class="form-group">
              <label for="password">Password</label>
              <input
                type="password"
                id="password"
                [(ngModel)]="newPassword"
                name="password"
                placeholder="Enter password"
                [class.ng-invalid]="formSubmitted && !isPasswordValid"
                [class.ng-touched]="formSubmitted"
              />
              <span *ngIf="formSubmitted && !isPasswordValid" class="error-message">
                Password must be at least 6 characters.
              </span>
            </div>

            <div class="form-group">
              <label for="role">Role</label>
              <select
                id="role"
                [(ngModel)]="newRole"
                name="role"
                class="role-selector"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn-submit" [disabled]="formSubmitted && !isFormValid">
              Create User
            </button>
            <button type="button" class="btn-cancel" (click)="cancelCreate()">
              Cancel
            </button>
          </div>
        </form>
      </div>

      <!-- Desktop Table -->
      <div class="user-table-container">
        <table class="user-table" *ngIf="users.length > 0">
          <thead>
            <tr>
              <th>Avatar</th>
              <th>Name</th>
              <th>Username</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let user of users">
              <td>
                <app-avatar [role]="user.role" size="sm"></app-avatar>
              </td>
              <td>
                <span class="user-name">{{ user.displayName }}</span>
              </td>
              <td>
                <span class="user-email">{{ user.username }}</span>
              </td>
              <td>
                <span class="role-badge" [ngClass]="user.role">{{ user.role }}</span>
              </td>
              <td>
                <div class="actions-cell">
                  <button
                    class="btn-delete"
                    (click)="onDeleteUser(user)"
                    [disabled]="isDeleteDisabled(user)"
                    [title]="getDeleteTooltip(user)"
                  >
                    Delete
                  </button>
                  <span *ngIf="isDeleteDisabled(user)" class="protected-indicator">
                    🔒 Protected
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div *ngIf="users.length === 0" class="empty-state">
          <p>No users found.</p>
        </div>
      </div>

      <!-- Mobile Cards -->
      <div class="user-cards">
        <div *ngIf="users.length === 0" class="empty-state">
          <p>No users found.</p>
        </div>

        <div *ngFor="let user of users" class="user-card">
          <div class="user-card-header">
            <div class="user-card-info">
              <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
                <app-avatar [role]="user.role" size="sm"></app-avatar>
                <span class="user-name">{{ user.displayName }}</span>
              </div>
              <span class="user-email">&#64;{{ user.username }}</span>
            </div>
            <span class="role-badge" [ngClass]="user.role">{{ user.role }}</span>
          </div>
          <div class="user-card-meta">
            <span *ngIf="isDeleteDisabled(user)" class="protected-indicator">
              🔒 Protected
            </span>
            <div class="user-card-actions">
              <button
                class="btn-delete"
                (click)="onDeleteUser(user)"
                [disabled]="isDeleteDisabled(user)"
                [title]="getDeleteTooltip(user)"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./user-management.component.css'],
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  currentSession: Session | null = null;

  showCreateForm = false;

  newDisplayName = '';
  newUsername = '';
  newPassword = '';
  newRole: Role = 'user';

  formSubmitted = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentSession = this.authService.getCurrentUser();
    this.loadUsers();
  }

  loadUsers(): void {
    this.users = this.userService.getAllUsers();
  }

  toggleCreateForm(): void {
    this.showCreateForm = !this.showCreateForm;
    if (!this.showCreateForm) {
      this.resetForm();
    }
  }

  resetForm(): void {
    this.newDisplayName = '';
    this.newUsername = '';
    this.newPassword = '';
    this.newRole = 'user';
    this.formSubmitted = false;
    this.errorMessage = '';
    this.successMessage = '';
  }

  get isDisplayNameValid(): boolean {
    return this.newDisplayName.trim().length >= 2;
  }

  get isUsernameValid(): boolean {
    return this.newUsername.trim().length >= 3;
  }

  get isPasswordValid(): boolean {
    return this.newPassword.length >= 6;
  }

  get isFormValid(): boolean {
    return this.isDisplayNameValid && this.isUsernameValid && this.isPasswordValid;
  }

  onCreateUser(): void {
    this.formSubmitted = true;
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.isFormValid) {
      return;
    }

    const existingUser = this.userService.getUserByUsername(this.newUsername.trim());
    if (existingUser) {
      this.errorMessage = 'Username is already taken. Please choose a different one.';
      return;
    }

    const id = 'user-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 9);

    const newUser: User = {
      id,
      displayName: this.newDisplayName.trim(),
      username: this.newUsername.trim(),
      password: this.newPassword,
      role: this.newRole,
    };

    const created = this.userService.createUser(newUser);
    if (!created) {
      this.errorMessage = 'Failed to create user. Username may already exist.';
      return;
    }

    this.successMessage = `User "${newUser.displayName}" created successfully.`;
    this.loadUsers();
    this.resetForm();
    this.showCreateForm = false;
  }

  cancelCreate(): void {
    this.showCreateForm = false;
    this.resetForm();
  }

  isDeleteDisabled(user: User): boolean {
    if (user.id === ADMIN_CREDENTIALS.id || user.username === ADMIN_CREDENTIALS.username) {
      return true;
    }
    if (this.currentSession && user.id === this.currentSession.userId) {
      return true;
    }
    return false;
  }

  getDeleteTooltip(user: User): string {
    if (user.id === ADMIN_CREDENTIALS.id || user.username === ADMIN_CREDENTIALS.username) {
      return 'Cannot delete the default admin';
    }
    if (this.currentSession && user.id === this.currentSession.userId) {
      return 'Cannot delete yourself';
    }
    return 'Delete user';
  }

  onDeleteUser(user: User): void {
    if (this.isDeleteDisabled(user)) {
      return;
    }

    const confirmed = confirm(`Are you sure you want to delete user "${user.displayName}"? This action cannot be undone.`);
    if (!confirmed) {
      return;
    }

    const deleted = this.userService.deleteUser(user.id);
    if (deleted) {
      this.successMessage = `User "${user.displayName}" has been deleted.`;
      this.errorMessage = '';
      this.loadUsers();
    } else {
      this.errorMessage = `Failed to delete user "${user.displayName}".`;
      this.successMessage = '';
    }
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map((part) => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }
}