'use client';

import { Clock, User } from 'lucide-react';
import { AccountAvatarMenu, type AccountAvatarMenuItem } from '@/components/account-avatar-menu';

const artisanMenuItems: AccountAvatarMenuItem[] = [
  { label: 'Profile', href: '/artisan/profile', icon: User },
  { label: 'Availability', href: '/artisan/availability', icon: Clock },
];

export function ArtisanAvatarMenu() {
  return (
    <AccountAvatarMenu
      items={artisanMenuItems}
      fallbackAlt="Artisan avatar"
      logoutLabel="Sign out"
    />
  );
}
