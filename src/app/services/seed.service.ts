import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import type { User, BlogPost } from '../models';
import { USERS_KEY, POSTS_KEY, SEEDED_KEY } from '../models';

@Injectable({ providedIn: 'root' })
export class SeedService {
  constructor(private localStorageService: LocalStorageService) {}

  seed(): void {
    const alreadySeeded = this.localStorageService.getItem<boolean>(SEEDED_KEY);
    if (alreadySeeded) {
      return;
    }

    const users = this.createDummyUsers();
    const posts = this.createDummyPosts(users);

    this.localStorageService.setItem(USERS_KEY, users);
    this.localStorageService.setItem(POSTS_KEY, posts);
    this.localStorageService.setItem(SEEDED_KEY, true);
  }

  private generateId(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  private createDummyUsers(): User[] {
    return [
      {
        id: this.generateId(),
        displayName: 'Jane Doe',
        username: 'janedoe',
        password: 'password123',
        role: 'user',
      },
      {
        id: this.generateId(),
        displayName: 'John Smith',
        username: 'johnsmith',
        password: 'password123',
        role: 'user',
      },
      {
        id: this.generateId(),
        displayName: 'Alice Writer',
        username: 'alicewriter',
        password: 'password123',
        role: 'user',
      },
    ];
  }

  private createDummyPosts(users: User[]): BlogPost[] {
    const now = new Date();

    return [
      {
        id: this.generateId(),
        title: 'Getting Started with Angular 17',
        content:
          'Angular 17 introduces a host of new features that make building modern web applications easier than ever. From the new control flow syntax to improved server-side rendering, this release is a game changer for the Angular ecosystem. In this post, we explore the key highlights and how you can start leveraging them in your projects today.',
        excerpt:
          'Explore the exciting new features in Angular 17 and how they improve the developer experience.',
        authorId: users[0].id,
        authorName: users[0].displayName,
        authorRole: users[0].role,
        createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: this.generateId(),
        title: 'The Art of Writing Clean Code',
        content:
          'Clean code is not just about making your code work — it is about making it readable, maintainable, and elegant. Good naming conventions, small focused functions, and thoughtful abstractions are the pillars of clean code. This article dives into practical tips and real-world examples that will help you write code your future self will thank you for.',
        excerpt:
          'Practical tips and principles for writing code that is readable, maintainable, and elegant.',
        authorId: users[1].id,
        authorName: users[1].displayName,
        authorRole: users[1].role,
        createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: this.generateId(),
        title: 'Understanding TypeScript Generics',
        content:
          'TypeScript generics allow you to create reusable components that work with a variety of types rather than a single one. They are one of the most powerful features of the type system. In this guide, we break down generics from the basics to advanced patterns including constraints, conditional types, and mapped types.',
        excerpt:
          'A comprehensive guide to TypeScript generics, from basic concepts to advanced patterns.',
        authorId: users[2].id,
        authorName: users[2].displayName,
        authorRole: users[2].role,
        createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: this.generateId(),
        title: 'Building Responsive Layouts with CSS Grid',
        content:
          'CSS Grid has revolutionized the way we build layouts on the web. Gone are the days of float hacks and complex flexbox workarounds for two-dimensional layouts. This post walks you through creating responsive, production-ready layouts using CSS Grid, complete with practical examples and common patterns you can use right away.',
        excerpt:
          'Learn how to create modern, responsive web layouts using the power of CSS Grid.',
        authorId: users[0].id,
        authorName: users[0].displayName,
        authorRole: users[0].role,
        createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: this.generateId(),
        title: 'RxJS Patterns Every Angular Developer Should Know',
        content:
          'Reactive programming with RxJS is at the heart of Angular applications. Understanding key patterns like switchMap for search inputs, combineLatest for combining streams, and shareReplay for caching can dramatically improve your application performance and code quality. This article covers the essential RxJS patterns with real Angular examples.',
        excerpt:
          'Master the essential RxJS patterns that will level up your Angular development skills.',
        authorId: users[1].id,
        authorName: users[1].displayName,
        authorRole: users[1].role,
        createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];
  }
}