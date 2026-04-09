import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BlogService } from '../../services/blog.service';
import { SessionService } from '../../services/session.service';
import { AvatarComponent } from '../../components/avatar/avatar.component';
import type { BlogPost, Session } from '../../models';

@Component({
  selector: 'app-read-blog',
  standalone: true,
  imports: [CommonModule, RouterLink, AvatarComponent],
  templateUrl: './read-blog.component.html',
  styleUrls: ['./read-blog.component.css'],
})
export class ReadBlogComponent implements OnInit {
  post: BlogPost | null = null;
  session: Session | null = null;
  isLoading = true;
  notFound = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private blogService: BlogService,
    private sessionService: SessionService
  ) {}

  ngOnInit(): void {
    this.session = this.sessionService.getSession();
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.isLoading = false;
      this.notFound = true;
      return;
    }

    const post = this.blogService.getPostById(id);
    if (!post) {
      this.isLoading = false;
      this.notFound = true;
      return;
    }

    this.post = post;
    this.isLoading = false;
  }

  get canEditOrDelete(): boolean {
    if (!this.session || !this.post) {
      return false;
    }
    return this.session.role === 'admin' || this.session.userId === this.post.authorId;
  }

  get formattedDate(): string {
    if (!this.post) {
      return '';
    }
    const date = new Date(this.post.createdAt);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  get updatedDate(): string {
    if (!this.post) {
      return '';
    }
    const date = new Date(this.post.updatedAt);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  get isUpdated(): boolean {
    if (!this.post) {
      return false;
    }
    return this.post.createdAt !== this.post.updatedAt;
  }

  onEdit(): void {
    if (this.post) {
      this.router.navigate(['/blog', 'edit', this.post.id]);
    }
  }

  onDelete(): void {
    if (!this.post) {
      return;
    }

    const confirmed = window.confirm('Are you sure you want to delete this post? This action cannot be undone.');
    if (!confirmed) {
      return;
    }

    const deleted = this.blogService.deletePost(this.post.id);
    if (deleted) {
      this.router.navigate(['/blogs']);
    }
  }
}
```

Wait, I need to also create the template file. But the task only asks for the `.ts` file. Let me check — the component references `templateUrl: './read-blog.component.html'`. I need to check if that file exists. It's not in the existing codebase. But the task says to generate only `read-blog.component.ts`. However, using `templateUrl` pointing to a non-existent file would cause a build error.

Let me use an inline template instead to ensure it compiles:

```typescript
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BlogService } from '../../services/blog.service';
import { SessionService } from '../../services/session.service';
import { AvatarComponent } from '../../components/avatar/avatar.component';
import type { BlogPost, Session } from '../../models';

@Component({
  selector: 'app-read-blog',
  standalone: true,
  imports: [CommonModule, RouterLink, AvatarComponent],
  template: `
    <div *ngIf="isLoading" class="loading-container">
      <p>Loading post...</p>
    </div>

    <div *ngIf="!isLoading && notFound" class="not-found">
      <div class="not-found-icon">📄</div>
      <h2 class="not-found-title">Post not found</h2>
      <p class="not-found-message">
        The blog post you're looking for doesn't exist or may have been removed.
      </p>
      <a routerLink="/blogs" class="btn-back">Back to Blog</a>
    </div>

    <div *ngIf="!isLoading && !notFound && post" class="article-container">
      <header class="article-header">
        <h1 class="article-title">{{ post.title }}</h1>
        <div class="article-meta">
          <div class="article-author-info">
            <app-avatar [role]="post.authorRole" size="sm"></app-avatar>
            <span class="article-author">{{ post.authorName }}</span>
          </div>
          <span class="article-meta-separator"></span>
          <span class="article-date">{{ formattedDate }}</span>
          <ng-container *ngIf="isUpdated">
            <span class="article-meta-separator"></span>
            <span class="article-date">Updated {{ updatedDate }}</span>
          </ng-container>
        </div>
      </header>

      <div class="article-body">
        <p *ngFor="let paragraph of contentParagraphs">{{ paragraph }}</p>
      </div>

      <div *ngIf="canEditOrDelete" class="article-actions">
        <button class="btn-edit" (click)="onEdit()">Edit</button>
        <button class="btn-delete" (click)="onDelete()">Delete</button>
      </div>
    </div>
  `,
  styleUrls: ['./read-blog.component.css'],
})
export class ReadBlogComponent implements OnInit {
  post: BlogPost | null = null;
  session: Session | null = null;
  isLoading = true;
  notFound = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private blogService: BlogService,
    private sessionService: SessionService
  ) {}

  ngOnInit(): void {
    this.session = this.sessionService.getSession();
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.isLoading = false;
      this.notFound = true;
      return;
    }

    const post = this.blogService.getPostById(id);
    if (!post) {
      this.isLoading = false;
      this.notFound = true;
      return;
    }

    this.post = post;
    this.isLoading = false;
  }

  get canEditOrDelete(): boolean {
    if (!this.session || !this.post) {
      return false;
    }
    return this.session.role === 'admin' || this.session.userId === this.post.authorId;
  }

  get formattedDate(): string {
    if (!this.post) {
      return '';
    }
    const date = new Date(this.post.createdAt);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  get updatedDate(): string {
    if (!this.post) {
      return '';
    }
    const date = new Date(this.post.updatedAt);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  get isUpdated(): boolean {
    if (!this.post) {
      return false;
    }
    return this.post.createdAt !== this.post.updatedAt;
  }

  get contentParagraphs(): string[] {
    if (!this.post) {
      return [];
    }
    return this.post.content.split('\n').filter((p) => p.trim().length > 0);
  }

  onEdit(): void {
    if (this.post) {
      this.router.navigate(['/blog', 'edit', this.post.id]);
    }
  }

  onDelete(): void {
    if (!this.post) {
      return;
    }

    const confirmed = window.confirm('Are you sure you want to delete this post? This action cannot be undone.');
    if (!confirmed) {
      return;
    }

    const deleted = this.blogService.deletePost(this.post.id);
    if (deleted) {
      this.router.navigate(['/blogs']);
    }
  }
}