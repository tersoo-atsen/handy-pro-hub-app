'use client';

import { Settings, User } from 'lucide-react';
import { AccountAvatarMenu, type AccountAvatarMenuItem } from '@/components/account-avatar-menu';

const customerMenuItems: AccountAvatarMenuItem[] = [
  { label: 'Profile', href: '/customer/profile', icon: User },
  { label: 'Settings', href: '/customer/settings', icon: Settings },
];

export function CustomerAvatarMenu() {
  return (
    <AccountAvatarMenu
      items={customerMenuItems}
      fallbackAlt="Customer avatar"
    />
  );
}
