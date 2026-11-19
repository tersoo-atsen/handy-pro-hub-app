'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut, User, type LucideIcon } from 'lucide-react';
import { useUser } from '@/hooks/use-user';
import { signOut } from '@/features/auth/services/auth-service';

export interface AccountAvatarMenuItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

interface AccountAvatarMenuProps {
  items: AccountAvatarMenuItem[];
  fallbackAlt?: string;
  logoutLabel?: string;
}

function getInitials(name?: string): string {
  const parts = (name || '').trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function AccountAvatarMenu({
  items,
  fallbackAlt = 'User avatar',
  logoutLabel = 'Logout',
}: AccountAvatarMenuProps) {
  const router = useRouter();
  const { profile } = useUser();
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  const handleLogout = async () => {
    setSigningOut(true);
    await signOut();
    setOpen(false);
    router.push('/login');
    router.refresh();
  };

  const initials = getInitials(profile?.full_name);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="h-9 w-9 rounded-full flex items-center justify-center overflow-hidden transition-transform hover:scale-105"
        style={{
          background: 'var(--color-primary-50)',
          color: 'var(--color-primary)',
          border: '1px solid var(--color-border)',
        }}
        aria-expanded={open}
        aria-label="Account menu"
      >
        {profile?.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt={profile.full_name || fallbackAlt}
            className="h-full w-full object-cover"
          />
        ) : initials ? (
          <span className="text-xs font-bold">{initials}</span>
        ) : (
          <User className="h-4 w-4" />
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-52 rounded-md shadow-lift overflow-hidden z-50"
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
          }}
        >
          {profile && (
            <div className="px-3.5 py-2.5" style={{ borderBottom: '1px solid var(--color-border-light)' }}>
              <p className="text-xs font-semibold truncate">{profile.full_name}</p>
              <p className="text-[11px] truncate" style={{ color: 'var(--color-text-secondary)' }}>
                {profile.email}
              </p>
            </div>
          )}

          <div className="p-1.5 space-y-0.5">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm font-medium transition-colors hover:bg-[var(--color-surface-hover)]"
                style={{ color: 'var(--color-text)' }}
              >
                <item.icon className="h-4 w-4" style={{ color: 'var(--color-text-secondary)' }} />
                {item.label}
              </Link>
            ))}
          </div>

          <div style={{ borderTop: '1px solid var(--color-border-light)' }} />

          <div className="p-1.5">
            <button
              type="button"
              disabled={signingOut}
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm font-medium transition-colors hover:bg-[var(--color-surface-hover)] disabled:opacity-60"
              style={{ color: '#EF4444' }}
            >
              <LogOut className="h-4 w-4" />
              {signingOut ? 'Logging out...' : logoutLabel}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
