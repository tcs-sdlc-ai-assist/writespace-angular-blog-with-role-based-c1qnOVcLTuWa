import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { BlogService } from '../../services/blog.service';
import { UserService } from '../../services/user.service';
import { SessionService } from '../../services/session.service';
import { AvatarComponent } from '../../components/avatar/avatar.component';
import type { BlogPost, User, Session } from '../../models';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, AvatarComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
})
export class AdminDashboardComponent implements OnInit {
  posts: BlogPost[] = [];
  users: User[] = [];
  session: Session | null = null;
  recentPosts: BlogPost[] = [];

  totalPosts = 0;
  totalUsers = 0;
  adminCount = 0;
  userCount = 0;

  constructor(
    private blogService: BlogService,
    private userService: UserService,
    private sessionService: SessionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.session = this.sessionService.getSession();
    this.loadData();
  }

  loadData(): void {
    this.posts = this.blogService.getAllPosts();
    this.users = this.userService.getAllUsers();

    this.totalPosts = this.posts.length;
    this.totalUsers = this.users.length;
    this.adminCount = this.users.filter((u) => u.role === 'admin').length;
    this.userCount = this.users.filter((u) => u.role === 'user').length;

    this.recentPosts = this.posts.slice(0, 5);
  }

  getAuthorInitial(name: string): string {
    return name.charAt(0).toUpperCase();
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  navigateToWrite(): void {
    this.router.navigate(['/write']);
  }

  navigateToUsers(): void {
    this.router.navigate(['/admin/users']);
  }

  navigateToBlogs(): void {
    this.router.navigate(['/blogs']);
  }

  editPost(post: BlogPost): void {
    this.router.navigate(['/edit', post.id]);
  }

  deletePost(post: BlogPost): void {
    const confirmed = confirm(`Are you sure you want to delete "${post.title}"?`);
    if (confirmed) {
      this.blogService.deletePost(post.id);
      this.loadData();
    }
  }

  viewPost(post: BlogPost): void {
    this.router.navigate(['/blog', post.id]);
  }
}