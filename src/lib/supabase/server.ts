import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();

  const getStoredUser = () => {
    const rawUser = cookieStore.get('handy_user')?.value;
    if (!rawUser) return null;
    try {
      return JSON.parse(decodeURIComponent(rawUser));
    } catch {
      return null;
    }
  };

  return {
    auth: {
      getUser: async () => {
        const user = getStoredUser();
        return { data: { user }, error: null };
      },
      getSession: async () => {
        const user = getStoredUser();
        const accessToken = cookieStore.get('access_token')?.value;
        const session = user ? { user, access_token: accessToken ?? '' } : null;
        return { data: { session }, error: null };
      },
      exchangeCodeForSession: async () => ({ data: null, error: null }),
    },
  } as any;
}
