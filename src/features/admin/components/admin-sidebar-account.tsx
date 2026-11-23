'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, MoreHorizontal } from 'lucide-react';
import { useUser } from '@/hooks/use-user';
import { signOut } from '@/features/auth/services/auth-service';

function getInitials(name: string): string {
  const parts = (name || '').trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'AD';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function AdminSidebarAccount() {
  const router = useRouter();
  const { profile } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
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
  }, [menuOpen]);

  const handleSignOut = async () => {
    setSigningOut(true);
    await signOut();
    setMenuOpen(false);
    router.push('/login');
    router.refresh();
  };

  const displayName = profile?.full_name || 'Admin';
  const initials = getInitials(displayName);

  return (
    <div ref={containerRef} className="relative">
      {menuOpen && (
        <div
          className="absolute bottom-full left-0 right-0 mb-2 rounded-md shadow-lift overflow-hidden z-50"
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
          }}
        >
          <div className="px-3.5 py-3">
            <p className="text-sm font-semibold truncate">{displayName}</p>
            {profile?.email && (
              <p className="text-xs truncate mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>
                {profile.email}
              </p>
            )}
          </div>

          <div style={{ borderTop: '1px solid var(--color-border-light)' }} />

          <div className="p-1.5">
            <button
              type="button"
              disabled={signingOut}
              onClick={handleSignOut}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm font-medium transition-colors hover:bg-[var(--color-surface-hover)] disabled:opacity-60"
              style={{ color: '#EF4444' }}
            >
              <LogOut className="h-4 w-4 shrink-0" />
              {signingOut ? 'Signing out...' : 'Sign out'}
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setMenuOpen((v) => !v)}
        className="w-full rounded-md p-2.5 flex items-center justify-between gap-2.5 text-left transition-colors hover:bg-[var(--color-surface-hover)]"
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
        }}
        aria-expanded={menuOpen}
        aria-label="Account menu"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className="h-9 w-9 rounded-md flex items-center justify-center text-xs font-bold shrink-0"
            style={{
              background: 'var(--color-primary-50)',
              color: 'var(--color-primary)',
            }}
          >
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate">{displayName}</p>
            <p className="text-xs truncate" style={{ color: 'var(--color-text-secondary)' }}>
              Administrator
            </p>
          </div>
        </div>
        <MoreHorizontal className="h-4 w-4 shrink-0" style={{ color: 'var(--color-text-secondary)' }} />
      </button>
    </div>
  );
}
