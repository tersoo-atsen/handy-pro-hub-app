'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/providers/auth-provider';
import { useSupabase } from '@/providers/supabase-provider';

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
  const { supabase } = useSupabase();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setIsLoading(false);
      return;
    }

    async function fetchProfile() {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user!.id)
        .single();

      if (!error && data) {
        setProfile(data as unknown as UserProfile);
      }
      setIsLoading(false);
    }

    fetchProfile();
  }, [user, supabase]);

  return { profile, isLoading };
}
