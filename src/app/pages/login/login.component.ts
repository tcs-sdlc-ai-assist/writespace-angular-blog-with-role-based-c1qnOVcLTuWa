import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  formError: string = '';
  isSubmitting: boolean = false;

  constructor(
    private authService: AuthService,
    private sessionService: SessionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const session = this.sessionService.getSession();
    if (session) {
      if (session.role === 'admin') {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/blogs']);
      }
      return;
    }

    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.minLength(3)]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });
  }

  get username(): FormControl {
    return this.loginForm.get('username') as FormControl;
  }

  get password(): FormControl {
    return this.loginForm.get('password') as FormControl;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.formError = '';

    const usernameValue: string = this.loginForm.value.username.trim();
    const passwordValue: string = this.loginForm.value.password;

    const success = this.authService.login(usernameValue, passwordValue);

    if (success) {
      const session = this.sessionService.getSession();
      if (session?.role === 'admin') {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/blogs']);
      }
    } else {
      this.formError = 'Invalid username or password. Please try again.';
      this.isSubmitting = false;
    }
  }
}