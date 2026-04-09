import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { SessionService } from '../../services/session.service';
import { AuthService } from '../../services/auth.service';
import { AvatarComponent } from '../avatar/avatar.component';
import type { Session } from '../../models';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, AvatarComponent],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  session: Session | null = null;
  mobileMenuOpen = false;

  private sessionSubscription: Subscription | null = null;

  constructor(
    private sessionService: SessionService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.sessionSubscription = this.sessionService.session$.subscribe((session) => {
      this.session = session;
    });
  }

  ngOnDestroy(): void {
    if (this.sessionSubscription) {
      this.sessionSubscription.unsubscribe();
    }
  }

  get isAuthenticated(): boolean {
    return this.session !== null;
  }

  get isAdmin(): boolean {
    return this.session?.role === 'admin';
  }

  get displayName(): string {
    return this.session?.displayName ?? '';
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }

  logout(): void {
    this.authService.logout();
    this.closeMobileMenu();
    this.router.navigate(['/']);
  }
}