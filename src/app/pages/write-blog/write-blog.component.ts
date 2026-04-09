import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BlogService } from '../../services/blog.service';
import { SessionService } from '../../services/session.service';
import type { Session, BlogPost } from '../../models';

@Component({
  selector: 'app-write-blog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './write-blog.component.html',
  styleUrls: ['./write-blog.component.css'],
})
export class WriteBlogComponent implements OnInit {
  blogForm!: FormGroup;
  session: Session | null = null;
  isSubmitting = false;
  serverError = '';
  successMessage = '';

  readonly titleMaxLength = 150;
  readonly contentMaxLength = 10000;

  constructor(
    private blogService: BlogService,
    private sessionService: SessionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.session = this.sessionService.getSession();

    if (!this.session) {
      this.router.navigate(['/login']);
      return;
    }

    this.blogForm = new FormGroup({
      title: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(this.titleMaxLength),
      ]),
      content: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(this.contentMaxLength),
      ]),
    });
  }

  get titleControl(): FormControl {
    return this.blogForm.get('title') as FormControl;
  }

  get contentControl(): FormControl {
    return this.blogForm.get('content') as FormControl;
  }

  get titleCharCount(): number {
    return this.titleControl.value?.length ?? 0;
  }

  get contentCharCount(): number {
    return this.contentControl.value?.length ?? 0;
  }

  getTitleCounterClass(): string {
    const ratio = this.titleCharCount / this.titleMaxLength;
    if (ratio >= 1) return 'limit';
    if (ratio >= 0.85) return 'warning';
    return '';
  }

  getContentCounterClass(): string {
    const ratio = this.contentCharCount / this.contentMaxLength;
    if (ratio >= 1) return 'limit';
    if (ratio >= 0.85) return 'warning';
    return '';
  }

  onSubmit(): void {
    if (this.blogForm.invalid) {
      this.blogForm.markAllAsTouched();
      return;
    }

    if (!this.session) {
      this.serverError = 'You must be logged in to create a post.';
      return;
    }

    this.isSubmitting = true;
    this.serverError = '';
    this.successMessage = '';

    const title: string = this.titleControl.value.trim();
    const content: string = this.contentControl.value.trim();
    const excerpt = content.length > 200 ? content.substring(0, 200) + '...' : content;

    const now = new Date().toISOString();

    const newPost: BlogPost = {
      id: this.generateId(),
      title,
      content,
      excerpt,
      authorId: this.session.userId,
      authorName: this.session.displayName,
      authorRole: this.session.role,
      createdAt: now,
      updatedAt: now,
    };

    try {
      this.blogService.createPost(newPost);
      this.successMessage = 'Post created successfully!';
      this.router.navigate(['/blogs']);
    } catch {
      this.serverError = 'Failed to create post. Please try again.';
      this.isSubmitting = false;
    }
  }

  onCancel(): void {
    window.history.back();
  }

  private generateId(): string {
    return 'post-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 9);
  }
}
```

Wait, I need to check — the component uses `templateUrl: './write-blog.component.html'` but I'm only generating the `.ts` file. Let me check if there's an HTML template that should exist. Since the task only asks me to generate the `.ts` file, and the component references a `templateUrl`, I need to use an inline template instead since the HTML file isn't provided in the existing codebase. Let me use an inline template.

```typescript
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BlogService } from '../../services/blog.service';
import { SessionService } from '../../services/session.service';
import type { Session, BlogPost } from '../../models';

@Component({
  selector: 'app-write-blog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="write-blog-container">
      <h2>Create New Post</h2>

      @if (successMessage) {
        <div class="success-message">{{ successMessage }}</div>
      }

      @if (serverError) {
        <div class="server-error">{{ serverError }}</div>
      }

      <form class="blog-form" [formGroup]="blogForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="title">Title</label>
          <input
            type="text"
            id="title"
            formControlName="title"
            placeholder="Enter your post title"
            [class.invalid]="titleControl.invalid && titleControl.touched"
          />
          <div class="char-counter" [ngClass]="getTitleCounterClass()">
            {{ titleCharCount }} / {{ titleMaxLength }}
          </div>
          @if (titleControl.invalid && titleControl.touched) {
            <div class="error-message">
              @if (titleControl.errors?.['required']) {
                Title is required.
              } @else if (titleControl.errors?.['minlength']) {
                Title must be at least 3 characters.
              } @else if (titleControl.errors?.['maxlength']) {
                Title cannot exceed {{ titleMaxLength }} characters.
              }
            </div>
          }
        </div>

        <div class="form-group">
          <label for="content">Content</label>
          <textarea
            id="content"
            formControlName="content"
            placeholder="Write your blog post content here..."
            [class.invalid]="contentControl.invalid && contentControl.touched"
          ></textarea>
          <div class="char-counter" [ngClass]="getContentCounterClass()">
            {{ contentCharCount }} / {{ contentMaxLength }}
          </div>
          @if (contentControl.invalid && contentControl.touched) {
            <div class="error-message">
              @if (contentControl.errors?.['required']) {
                Content is required.
              } @else if (contentControl.errors?.['minlength']) {
                Content must be at least 10 characters.
              } @else if (contentControl.errors?.['maxlength']) {
                Content cannot exceed {{ contentMaxLength }} characters.
              }
            </div>
          }
        </div>

        <div class="form-actions">
          <button
            type="button"
            class="btn btn-cancel"
            (click)="onCancel()"
            [disabled]="isSubmitting"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="btn btn-primary"
            [disabled]="isSubmitting || blogForm.invalid"
          >
            @if (isSubmitting) {
              <span class="spinner"></span> Publishing...
            } @else {
              Publish
            }
          </button>
        </div>
      </form>
    </div>
  `,
  styleUrls: ['./write-blog.component.css'],
})
export class WriteBlogComponent implements OnInit {
  blogForm!: FormGroup;
  session: Session | null = null;
  isSubmitting = false;
  serverError = '';
  successMessage = '';

  readonly titleMaxLength = 150;
  readonly contentMaxLength = 10000;

  constructor(
    private blogService: BlogService,
    private sessionService: SessionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.session = this.sessionService.getSession();

    if (!this.session) {
      this.router.navigate(['/login']);
      return;
    }

    this.blogForm = new FormGroup({
      title: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(this.titleMaxLength),
      ]),
      content: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(this.contentMaxLength),
      ]),
    });
  }

  get titleControl(): FormControl {
    return this.blogForm.get('title') as FormControl;
  }

  get contentControl(): FormControl {
    return this.blogForm.get('content') as FormControl;
  }

  get titleCharCount(): number {
    return this.titleControl.value?.length ?? 0;
  }

  get contentCharCount(): number {
    return this.contentControl.value?.length ?? 0;
  }

  getTitleCounterClass(): string {
    const ratio = this.titleCharCount / this.titleMaxLength;
    if (ratio >= 1) return 'limit';
    if (ratio >= 0.85) return 'warning';
    return '';
  }

  getContentCounterClass(): string {
    const ratio = this.contentCharCount / this.contentMaxLength;
    if (ratio >= 1) return 'limit';
    if (ratio >= 0.85) return 'warning';
    return '';
  }

  onSubmit(): void {
    if (this.blogForm.invalid) {
      this.blogForm.markAllAsTouched();
      return;
    }

    if (!this.session) {
      this.serverError = 'You must be logged in to create a post.';
      return;
    }

    this.isSubmitting = true;
    this.serverError = '';
    this.successMessage = '';

    const title: string = this.titleControl.value.trim();
    const content: string = this.contentControl.value.trim();
    const excerpt = content.length > 200 ? content.substring(0, 200) + '...' : content;

    const now = new Date().toISOString();

    const newPost: BlogPost = {
      id: this.generateId(),
      title,
      content,
      excerpt,
      authorId: this.session.userId,
      authorName: this.session.displayName,
      authorRole: this.session.role,
      createdAt: now,
      updatedAt: now,
    };

    try {
      this.blogService.createPost(newPost);
      this.successMessage = 'Post created successfully!';
      this.router.navigate(['/blogs']);
    } catch {
      this.serverError = 'Failed to create post. Please try again.';
      this.isSubmitting = false;
    }
  }

  onCancel(): void {
    window.history.back();
  }

  private generateId(): string {
    return 'post-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 9);
  }
}