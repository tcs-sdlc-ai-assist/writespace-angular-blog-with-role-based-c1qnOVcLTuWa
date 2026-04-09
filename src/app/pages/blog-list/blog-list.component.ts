import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { BlogService } from '../../services/blog.service';
import { SessionService } from '../../services/session.service';
import { AvatarComponent } from '../../components/avatar/avatar.component';
import type { BlogPost, Session } from '../../models';

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [CommonModule, RouterLink, AvatarComponent],
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.css'],
})
export class BlogListComponent implements OnInit {
  posts: BlogPost[] = [];
  session: Session | null = null;

  constructor(
    private blogService: BlogService,
    private sessionService: SessionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.session = this.sessionService.getSession();
    this.loadPosts();
  }

  loadPosts(): void {
    this.posts = this.blogService.getAllPosts();
  }

  get isAuthenticated(): boolean {
    return this.session !== null;
  }

  get isAdmin(): boolean {
    return this.session?.role === 'admin';
  }

  canEdit(post: BlogPost): boolean {
    if (!this.session) {
      return false;
    }
    if (this.session.role === 'admin') {
      return true;
    }
    return this.session.userId === post.authorId;
  }

  getInitial(name: string): string {
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

  navigateToPost(postId: string): void {
    this.router.navigate(['/blogs', postId]);
  }

  navigateToEdit(event: Event, postId: string): void {
    event.stopPropagation();
    this.router.navigate(['/blogs', 'edit', postId]);
  }

  navigateToWrite(): void {
    this.router.navigate(['/blogs', 'write']);
  }
}
```

Wait, I need to provide the template too since the component references `templateUrl`. Let me check — the task says to generate only `blog-list.component.ts`. The `templateUrl` points to `./blog-list.component.html` which needs to exist. But looking at the existing codebase, some components use inline `template` and some use `templateUrl`. Let me use an inline template to avoid needing a separate HTML file.

```typescript
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { BlogService } from '../../services/blog.service';
import { SessionService } from '../../services/session.service';
import { AvatarComponent } from '../../components/avatar/avatar.component';
import type { BlogPost, Session } from '../../models';

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [CommonModule, RouterLink, AvatarComponent],
  template: `
    <div class="blog-list-header">
      <h1>Blog Posts</h1>
      <button
        *ngIf="isAuthenticated"
        class="blog-list-empty-btn"
        (click)="navigateToWrite()"
      >
        ✍️ Write a Post
      </button>
    </div>

    <div *ngIf="posts.length === 0" class="blog-list-empty">
      <div class="blog-list-empty-icon">📝</div>
      <h2>No posts yet</h2>
      <p>Be the first to share your thoughts with the world.</p>
      <button
        *ngIf="isAuthenticated"
        class="blog-list-empty-btn"
        (click)="navigateToWrite()"
      >
        Write Your First Post
      </button>
      <button
        *ngIf="!isAuthenticated"
        class="blog-list-empty-btn"
        routerLink="/login"
      >
        Log In to Write
      </button>
    </div>

    <div *ngIf="posts.length > 0" class="blog-list-grid">
      <div
        *ngFor="let post of posts"
        class="post-card"
        (click)="navigateToPost(post.id)"
      >
        <div class="post-card-image-placeholder">
          {{ getInitial(post.title) }}
        </div>
        <div class="post-card-content">
          <h3 class="post-card-title">{{ post.title }}</h3>
          <p class="post-card-excerpt">{{ post.excerpt }}</p>
          <div class="post-card-footer">
            <div class="post-card-author">
              <app-avatar [role]="post.authorRole" size="sm"></app-avatar>
              <div class="post-card-author-info">
                <span class="post-card-author-name">{{ post.authorName }}</span>
                <span class="post-card-date">{{ formatDate(post.createdAt) }}</span>
              </div>
            </div>
            <button
              *ngIf="canEdit(post)"
              class="post-card-edit-btn"
              (click)="navigateToEdit($event, post.id)"
            >
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./blog-list.component.css'],
})
export class BlogListComponent implements OnInit {
  posts: BlogPost[] = [];
  session: Session | null = null;

  constructor(
    private blogService: BlogService,
    private sessionService: SessionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.session = this.sessionService.getSession();
    this.loadPosts();
  }

  loadPosts(): void {
    this.posts = this.blogService.getAllPosts();
  }

  get isAuthenticated(): boolean {
    return this.session !== null;
  }

  get isAdmin(): boolean {
    return this.session?.role === 'admin';
  }

  canEdit(post: BlogPost): boolean {
    if (!this.session) {
      return false;
    }
    if (this.session.role === 'admin') {
      return true;
    }
    return this.session.userId === post.authorId;
  }

  getInitial(name: string): string {
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

  navigateToPost(postId: string): void {
    this.router.navigate(['/blogs', postId]);
  }

  navigateToEdit(event: Event, postId: string): void {
    event.stopPropagation();
    this.router.navigate(['/blogs', 'edit', postId]);
  }

  navigateToWrite(): void {
    this.router.navigate(['/blogs', 'write']);
  }
}