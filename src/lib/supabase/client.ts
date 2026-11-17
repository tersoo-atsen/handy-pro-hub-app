// Browser-safe auth & query shim backed by custom backend session storage.
function getBrowserStoredUser() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem('handy_user');
    if (raw) return JSON.parse(raw);
    const match = document.cookie.match(/(?:^|;\s*)handy_user=([^;]*)/);
    if (match?.[1]) return JSON.parse(decodeURIComponent(match[1]));
  } catch {
    return null;
  }
  return null;
}

function getBrowserAccessToken() {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem('access_token');
  } catch {
    return null;
  }
}

export function createClient() {
  const noopQueryBuilder = () => {
    const builder: any = {
      select: () => builder,
      insert: () => builder,
      update: () => builder,
      delete: () => builder,
      upsert: () => builder,
      eq: () => builder,
      or: () => builder,
      ilike: () => builder,
      order: () => builder,
      limit: () => builder,
      single: async () => ({ data: null, error: null }),
      then: (resolve: any) => Promise.resolve({ data: [], error: null }).then(resolve),
    };
    return builder;
  };

  return {
    from: () => noopQueryBuilder(),
    rpc: async () => ({ data: [], error: null }),
    auth: {
      getUser: async () => {
        const user = getBrowserStoredUser();
        return { data: { user }, error: null };
      },
      getSession: async () => {
        const user = getBrowserStoredUser();
        const access_token = getBrowserAccessToken() ?? '';
        const session = user ? { user, access_token } : null;
        return { data: { session }, error: null };
      },
      onAuthStateChange: (callback?: (event: string, session: any) => void) => {
        if (typeof window !== 'undefined' && callback) {
          const handler = () => {
            const user = getBrowserStoredUser();
            const access_token = getBrowserAccessToken() ?? '';
            callback('TOKEN_REFRESHED', user ? { user, access_token } : null);
          };
          window.addEventListener('handy-auth-change', handler);
          return {
            data: {
              subscription: {
                unsubscribe: () => window.removeEventListener('handy-auth-change', handler),
              },
            },
          };
        }
        return {
          data: { subscription: { unsubscribe: () => {} } },
        };
      },
      signInWithPassword: async () => ({ data: null, error: null }),
      signUp: async () => ({ data: null, error: null }),
      signOut: async () => ({ error: null }),
      resetPasswordForEmail: async () => ({ data: null, error: null }),
      exchangeCodeForSession: async () => ({ data: null, error: null }),
    },
  } as any;
}
