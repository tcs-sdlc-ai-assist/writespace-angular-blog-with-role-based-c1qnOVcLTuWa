import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BlogService } from '../../services/blog.service';
import { SessionService } from '../../services/session.service';
import type { BlogPost, Session } from '../../models';

@Component({
  selector: 'app-edit-blog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './edit-blog.component.html',
  styleUrls: ['./edit-blog.component.css'],
})
export class EditBlogComponent implements OnInit {
  editForm!: FormGroup;
  post: BlogPost | null = null;
  session: Session | null = null;
  isLoading = true;
  errorMessage = '';
  formSubmitted = false;

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
      this.router.navigate(['/blogs']);
      return;
    }

    this.post = this.blogService.getPostById(id);

    if (!this.post) {
      this.router.navigate(['/blogs']);
      return;
    }

    if (!this.canEdit(this.post)) {
      this.router.navigate(['/blogs']);
      return;
    }

    this.isLoading = false;

    this.editForm = new FormGroup({
      title: new FormControl(this.post.title, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(200),
      ]),
      excerpt: new FormControl(this.post.excerpt, [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(500),
      ]),
      content: new FormControl(this.post.content, [
        Validators.required,
        Validators.minLength(20),
      ]),
    });
  }

  private canEdit(post: BlogPost): boolean {
    if (!this.session) {
      return false;
    }
    if (this.session.role === 'admin') {
      return true;
    }
    return this.session.userId === post.authorId;
  }

  get title(): FormControl {
    return this.editForm.get('title') as FormControl;
  }

  get excerpt(): FormControl {
    return this.editForm.get('excerpt') as FormControl;
  }

  get content(): FormControl {
    return this.editForm.get('content') as FormControl;
  }

  onSubmit(): void {
    this.formSubmitted = true;
    this.errorMessage = '';

    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    if (!this.post) {
      this.errorMessage = 'Post not found.';
      return;
    }

    const updatedPost: BlogPost = {
      ...this.post,
      title: this.title.value.trim(),
      excerpt: this.excerpt.value.trim(),
      content: this.content.value.trim(),
    };

    const success = this.blogService.updatePost(updatedPost);

    if (success) {
      this.router.navigate(['/blog', this.post.id]);
    } else {
      this.errorMessage = 'Failed to update the post. Please try again.';
    }
  }

  onCancel(): void {
    if (this.post) {
      this.router.navigate(['/blog', this.post.id]);
    } else {
      this.router.navigate(['/blogs']);
    }
  }
}