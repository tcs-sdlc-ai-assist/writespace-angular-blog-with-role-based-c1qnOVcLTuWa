import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import type { BlogPost } from '../models';
import { POSTS_KEY } from '../models';

@Injectable({ providedIn: 'root' })
export class BlogService {
  constructor(private localStorageService: LocalStorageService) {}

  getAllPosts(): BlogPost[] {
    const posts = this.localStorageService.getItem<BlogPost[]>(POSTS_KEY);
    if (!posts) {
      return [];
    }
    return this.sortNewestFirst(posts);
  }

  getPostById(id: string): BlogPost | null {
    const posts = this.getAllPosts();
    return posts.find((post) => post.id === id) ?? null;
  }

  createPost(post: BlogPost): BlogPost {
    const posts = this.localStorageService.getItem<BlogPost[]>(POSTS_KEY) ?? [];
    const now = new Date().toISOString();
    const newPost: BlogPost = {
      ...post,
      id: post.id || this.generateId(),
      createdAt: now,
      updatedAt: now,
    };
    posts.push(newPost);
    this.localStorageService.setItem(POSTS_KEY, posts);
    return newPost;
  }

  updatePost(post: BlogPost): boolean {
    const posts = this.localStorageService.getItem<BlogPost[]>(POSTS_KEY) ?? [];
    const index = posts.findIndex((p) => p.id === post.id);
    if (index === -1) {
      return false;
    }
    posts[index] = {
      ...posts[index],
      ...post,
      updatedAt: new Date().toISOString(),
    };
    this.localStorageService.setItem(POSTS_KEY, posts);
    return true;
  }

  deletePost(id: string): boolean {
    const posts = this.localStorageService.getItem<BlogPost[]>(POSTS_KEY) ?? [];
    const index = posts.findIndex((p) => p.id === id);
    if (index === -1) {
      return false;
    }
    posts.splice(index, 1);
    this.localStorageService.setItem(POSTS_KEY, posts);
    return true;
  }

  private sortNewestFirst(posts: BlogPost[]): BlogPost[] {
    return posts.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  private generateId(): string {
    return 'post-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 9);
  }
}