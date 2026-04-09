import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BlogService } from '../../services/blog.service';
import { SessionService } from '../../services/session.service';
import type { BlogPost, Session } from '../../models';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
})
export class LandingPageComponent implements OnInit {
  latestPosts: BlogPost[] = [];
  session: Session | null = null;

  features = [
    {
      icon: '✍️',
      title: 'Write with Ease',
      description:
        'A clean, distraction-free editor that lets you focus on what matters most — your words.',
    },
    {
      icon: '🚀',
      title: 'Publish Instantly',
      description:
        'Share your thoughts with the world in seconds. No complicated setup, no waiting.',
    },
    {
      icon: '🔒',
      title: 'Secure & Private',
      description:
        'Your data stays in your browser with localStorage persistence. Full control, always.',
    },
  ];

  constructor(
    private blogService: BlogService,
    private sessionService: SessionService
  ) {}

  ngOnInit(): void {
    this.session = this.sessionService.getSession();
    const allPosts = this.blogService.getAllPosts();
    this.latestPosts = allPosts.slice(0, 3);
  }

  get isAuthenticated(): boolean {
    return this.session !== null;
  }

  getPostInitial(title: string): string {
    return title.charAt(0).toUpperCase();
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
}