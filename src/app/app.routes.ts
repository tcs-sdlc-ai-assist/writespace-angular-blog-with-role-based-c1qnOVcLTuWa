import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/landing/landing.component').then((m) => m.LandingComponent),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'blogs',
    loadComponent: () =>
      import('./pages/blog-list/blog-list.component').then((m) => m.BlogListComponent),
    canActivate: [authGuard],
  },
  {
    path: 'write',
    loadComponent: () =>
      import('./pages/write-blog/write-blog.component').then((m) => m.WriteBlogComponent),
    canActivate: [authGuard],
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./pages/edit-blog/edit-blog.component').then((m) => m.EditBlogComponent),
    canActivate: [authGuard],
  },
  {
    path: 'blog/:id',
    loadComponent: () =>
      import('./pages/read-blog/read-blog.component').then((m) => m.ReadBlogComponent),
    canActivate: [authGuard],
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./pages/admin-dashboard/admin-dashboard.component').then((m) => m.AdminDashboardComponent),
    canActivate: [adminGuard],
  },
  {
    path: 'users',
    loadComponent: () =>
      import('./pages/user-management/user-management.component').then((m) => m.UserManagementComponent),
    canActivate: [adminGuard],
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];