'use client';

import { useEffect, useRef, useState } from 'react';
import { Camera, Loader2, Star, User, Wrench } from 'lucide-react';
import type { UserProfile } from '@/hooks/use-user';
import { updateProfile } from '@/features/profiles/services/profile-service';
import { VerificationBadge } from '@/features/artisans/components/verification-badge';

interface ProfileAvatarCardProps {
  profile: UserProfile;
  isArtisan?: boolean;
  ratingAvg?: number;
  ratingCount?: number;
  verifiedAt?: string | null;
}

function readImageAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      const img = new Image();
      img.onerror = () => resolve(result);
      img.onload = () => {
        const maxSize = 256;
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
        const width = Math.max(1, Math.round(img.width * scale));
        const height = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(result);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  });
}

export function ProfileAvatarCard({
  profile,
  isArtisan = false,
  ratingAvg = 0,
  ratingCount = 0,
  verifiedAt = null,
}: ProfileAvatarCardProps) {
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url || '');
  const [updatingAvatar, setUpdatingAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setAvatarUrl(profile.avatar_url || '');
  }, [profile.avatar_url]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setAvatarError(null);
    setUpdatingAvatar(true);
    try {
      const dataUrl = await readImageAsDataUrl(file);
      const { error } = await updateProfile(profile.id, { avatar_url: dataUrl });
      if (error) {
        setAvatarError(error.message || 'Failed to update avatar');
      } else {
        setAvatarUrl(dataUrl);
      }
    } catch {
      setAvatarError('Could not process the selected image');
    } finally {
      setUpdatingAvatar(false);
    }
  };

  const displayName = profile.full_name || 'Your Name';

  return (
    <div
      className="w-full rounded-md p-6"
      style={{
        background: 'var(--color-surface)',
        boxShadow: 'var(--shadow-sm)',
        border: '1px solid var(--color-border-light)',
      }}
    >
      <div className="flex flex-col items-center text-center gap-3">
        <div className="relative">
          <div
            className="h-20 w-20 rounded-full flex items-center justify-center overflow-hidden"
            style={{ background: 'var(--color-primary-50)' }}
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={displayName}
                className="h-full w-full object-cover"
              />
            ) : isArtisan ? (
              <Wrench className="h-8 w-8" style={{ color: 'var(--color-primary)' }} />
            ) : (
              <User className="h-8 w-8" style={{ color: 'var(--color-primary)' }} />
            )}
          </div>
          <button
            type="button"
            onClick={() => avatarInputRef.current?.click()}
            disabled={updatingAvatar}
            className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full flex items-center justify-center text-white gradient-primary cursor-pointer transition-all duration-150 hover:scale-110 hover:brightness-110 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
            style={{ boxShadow: 'var(--shadow-md)' }}
            aria-label="Change avatar"
          >
            {updatingAvatar ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Camera className="h-3.5 w-3.5" />
            )}
          </button>
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <h2 className="text-lg font-semibold" style={{ fontFamily: 'var(--font-outfit)' }}>
              {displayName}
            </h2>
            {isArtisan && (
              <VerificationBadge verified={Boolean(profile.is_verified || verifiedAt)} />
            )}
          </div>
          {isArtisan ? (
            <div className="flex items-center justify-center gap-1.5 mt-0.5 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
              <Star className="h-3.5 w-3.5" style={{ color: '#F59E0B', fill: '#F59E0B' }} />
              <span>
                {ratingAvg.toFixed(1)} rating · {ratingCount} reviews
              </span>
            </div>
          ) : (
            <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>
              Customer Account
            </p>
          )}
        </div>

        <input
          ref={avatarInputRef}
          type="file"
          accept="image/*"
          onChange={handleAvatarChange}
          className="hidden"
        />

        {avatarError && (
          <p className="text-xs" style={{ color: '#EF4444' }}>
            {avatarError}
          </p>
        )}
      </div>
    </div>
  );
}
