import { Injectable } from '@angular/core';
import type { Role, AvatarData } from '../models';

@Injectable({ providedIn: 'root' })
export class AvatarService {
  getAvatar(role: Role): AvatarData {
    switch (role) {
      case 'admin':
        return { emoji: '👑', backgroundColor: '#7b1fa2' };
      case 'user':
        return { emoji: '📖', backgroundColor: '#1976d2' };
    }
  }
}