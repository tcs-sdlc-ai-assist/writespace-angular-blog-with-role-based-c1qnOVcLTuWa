import { Component, Input } from '@angular/core';
import { AvatarService } from '../../services/avatar.service';
import type { Role, AvatarData } from '../../models';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [],
  template: `
    <div
      class="avatar"
      [class.avatar--sm]="size === 'sm'"
      [class.avatar--md]="size === 'md'"
      [class.avatar--lg]="size === 'lg'"
      [class.avatar--xl]="size === 'xl'"
      [style.background-color]="avatarData.backgroundColor"
    >
      <span class="avatar__emoji">{{ avatarData.emoji }}</span>
    </div>
  `,
  styleUrls: ['./avatar.component.css'],
})
export class AvatarComponent {
  @Input() role: Role = 'user';
  @Input() size: 'sm' | 'md' | 'lg' | 'xl' = 'md';

  avatarData: AvatarData = { emoji: '📖', backgroundColor: '#1976d2' };

  constructor(private avatarService: AvatarService) {}

  ngOnChanges(): void {
    this.avatarData = this.avatarService.getAvatar(this.role);
  }

  ngOnInit(): void {
    this.avatarData = this.avatarService.getAvatar(this.role);
  }
}