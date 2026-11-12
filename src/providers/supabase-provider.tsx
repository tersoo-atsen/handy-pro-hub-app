'use client';

import { createContext, useContext, useMemo } from 'react';

// Dynamically import the server‑only modules to avoid bundling them in the client bundle.
let serverQuery: ((text: string, params?: any[]) => any) | undefined;
let supabase: any;
if (typeof window === 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const dbMod = require('@/lib/db');
  serverQuery = dbMod.query;
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { createClient } = require('@/lib/supabase/client');
  supabase = createClient();
}

type DBContext = {
  query: (text: string, params?: any[]) => any;
  supabase: any;
};

const Context = createContext<DBContext | undefined>(undefined);

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  // Expose the query function and supabase client via context.
  // On the client, they will be stubs that throw if used.
  const db = useMemo(() => ({
    query: serverQuery
      ? serverQuery
      : async () => {
          throw new Error('query function is unavailable on the client side');
        },
    supabase: supabase
      ? supabase
      : {
          // minimal stub to avoid runtime errors on client side
          auth: {
            getSession: async () => ({ data: { session: null } }),
            onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
            signOut: async () => {},
          },
        },
  }), []);

  return (
    <Context.Provider value={db}>
      {children}
    </Context.Provider>
  );
}

export function useSupabase() {
  const context = useContext(Context);
  if (!context) {
    throw new Error('useSupabase must be used within SupabaseProvider');
  }
  return { query: context.query, supabase: context.supabase } as any;
}
