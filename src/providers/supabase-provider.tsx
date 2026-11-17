'use client';

import { createContext, useContext, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';

type DBContext = {
  supabase: ReturnType<typeof createClient>;
};

const Context = createContext<DBContext | undefined>(undefined);

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const db = useMemo(
    () => ({
      supabase: createClient(),
    }),
    []
  );

  return <Context.Provider value={db}>{children}</Context.Provider>;
}

export function useSupabase() {
  const context = useContext(Context);
  if (!context) {
    throw new Error('useSupabase must be used within SupabaseProvider');
  }
  return { supabase: context.supabase } as any;
}
