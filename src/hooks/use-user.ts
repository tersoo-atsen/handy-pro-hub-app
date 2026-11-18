'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/providers/auth-provider';
import { getProfileById } from '@/features/profiles/services/profile-service';

export interface UserProfile {
  id: string;
  role: 'customer' | 'artisan' | 'admin';
  full_name: string;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string;
  is_verified: boolean;
  is_active: boolean;
}

export function useUser() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchProfile() {
      const { data, error } = await getProfileById(user!.id);

      if (cancelled) return;

      if (!error && data) {
        setProfile(data as UserProfile);
      } else {
        const anyUser = user as any;
        setProfile({
          id: user!.id,
          role: anyUser.role ?? 'customer',
          full_name: anyUser.full_name ?? user!.email?.split('@')[0] ?? 'User',
          email: user!.email ?? '',
          phone: null,
          avatar_url: null,
          address: null,
          city: null,
          state: null,
          country: 'Nigeria',
          is_verified: false,
          is_active: true,
        });
      }
      setIsLoading(false);
    }

    fetchProfile();

    return () => {
      cancelled = true;
    };
  }, [user]);

  return { profile, isLoading };
}
