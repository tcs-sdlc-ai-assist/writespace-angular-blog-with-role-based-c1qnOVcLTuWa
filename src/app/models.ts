export type Role = 'admin' | 'user';

export interface User {
  id: string;
  displayName: string;
  username: string;
  password: string;
  role: Role;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  authorId: string;
  authorName: string;
  authorRole: Role;
  createdAt: string;
  updatedAt: string;
}

export interface Session {
  userId: string;
  username: string;
  displayName: string;
  role: Role;
}

export interface AvatarData {
  emoji: string;
  backgroundColor: string;
}

export const USERS_KEY = 'writespace_users';
export const POSTS_KEY = 'writespace_posts';
export const SESSION_KEY = 'writespace_session';
export const SEEDED_KEY = 'writespace_seeded';

export const ADMIN_CREDENTIALS: Readonly<User> = {
  id: 'admin-001',
  displayName: 'Admin',
  username: 'admin',
  password: 'admin123',
  role: 'admin',
};