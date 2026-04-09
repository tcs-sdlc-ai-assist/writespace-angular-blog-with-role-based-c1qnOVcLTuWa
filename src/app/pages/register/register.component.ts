import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  template: `
    <div class="register-card">
      <h2>Create Account</h2>
      <p class="subtitle">Join WriteSpace and start sharing your stories.</p>

      @if (formError) {
        <div class="form-error">{{ formError }}</div>
      }

      <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="displayName">Display Name</label>
          <input
            id="displayName"
            type="text"
            formControlName="displayName"
            placeholder="Enter your display name"
            [class.invalid]="isFieldInvalid('displayName')"
          />
          @if (isFieldInvalid('displayName')) {
            <span class="error-message">
              @if (registerForm.get('displayName')?.hasError('required')) {
                Display name is required.
              } @else if (registerForm.get('displayName')?.hasError('minlength')) {
                Display name must be at least 2 characters.
              }
            </span>
          }
        </div>

        <div class="form-group">
          <label for="username">Username</label>
          <input
            id="username"
            type="text"
            formControlName="username"
            placeholder="Choose a username"
            [class.invalid]="isFieldInvalid('username')"
          />
          @if (isFieldInvalid('username')) {
            <span class="error-message">
              @if (registerForm.get('username')?.hasError('required')) {
                Username is required.
              } @else if (registerForm.get('username')?.hasError('minlength')) {
                Username must be at least 3 characters.
              }
            </span>
          }
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            type="password"
            formControlName="password"
            placeholder="Create a password"
            [class.invalid]="isFieldInvalid('password')"
          />
          @if (isFieldInvalid('password')) {
            <span class="error-message">
              @if (registerForm.get('password')?.hasError('required')) {
                Password is required.
              } @else if (registerForm.get('password')?.hasError('minlength')) {
                Password must be at least 6 characters.
              }
            </span>
          }
          <span class="password-requirements">Minimum 6 characters</span>
        </div>

        <div class="form-group">
          <label for="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            formControlName="confirmPassword"
            placeholder="Confirm your password"
            [class.invalid]="isFieldInvalid('confirmPassword')"
          />
          @if (isFieldInvalid('confirmPassword')) {
            <span class="error-message">
              @if (registerForm.get('confirmPassword')?.hasError('required')) {
                Please confirm your password.
              } @else if (registerForm.get('confirmPassword')?.hasError('passwordMismatch')) {
                Passwords do not match.
              }
            </span>
          }
        </div>

        <button
          type="submit"
          class="submit-btn"
          [disabled]="registerForm.invalid || isSubmitting"
        >
          {{ isSubmitting ? 'Creating Account...' : 'Create Account' }}
        </button>
      </form>

      <p class="login-link">
        Already have an account? <a routerLink="/login">Sign in</a>
      </p>
    </div>
  `,
})
export class RegisterComponent {
  formError = '';
  isSubmitting = false;

  registerForm = new FormGroup({
    displayName: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
    ]),
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
    confirmPassword: new FormControl('', [
      Validators.required,
    ]),
  }, { validators: this.passwordMatchValidator });

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    if (confirmPassword.value && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    if (confirmPassword.hasError('passwordMismatch')) {
      confirmPassword.setErrors(null);
    }

    return null;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return field !== null && field.invalid && (field.dirty || field.touched);
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.formError = '';

    const displayName = this.registerForm.get('displayName')?.value?.trim() ?? '';
    const username = this.registerForm.get('username')?.value?.trim() ?? '';
    const password = this.registerForm.get('password')?.value ?? '';

    const existingUser = this.userService.getUserByUsername(username);
    if (existingUser) {
      this.formError = 'Username is already taken. Please choose a different one.';
      this.isSubmitting = false;
      return;
    }

    const success = this.authService.register(displayName, username, password);

    if (success) {
      this.router.navigate(['/blogs']);
    } else {
      this.formError = 'Registration failed. Username may already be taken.';
      this.isSubmitting = false;
    }
  }
}