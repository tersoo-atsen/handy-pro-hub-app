'use client';

import { useUser } from '@/hooks/use-user';
import { VerificationBadge } from './verification-badge';

export function ArtisanSidebarBadge() {
  const { profile } = useUser();

  return (
    <div className="text-center text-sm space-y-2">
      <p className="font-medium" style={{ color: 'var(--color-primary)' }}>
        Pro Artisan
      </p>
      <div className="flex justify-center">
        <VerificationBadge verified={profile?.is_verified} />
      </div>
    </div>
  );
}
