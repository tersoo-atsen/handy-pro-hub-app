import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getProfileById } from '@/features/profiles/services/profile-service';

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:5000').trim();

export default async function DashboardRedirect() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value;
  const cookieHeader = cookieStore.toString();

  if (!accessToken && !cookieStore.get('handy_user')?.value) {
    redirect('/login');
  }

  let user: { id: string; email?: string; role?: string } | null = null;

  if (accessToken) {
    try {
      const response = await fetch(`${API_BASE}/auth/me`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Cookie: cookieHeader,
        },
        cache: 'no-store',
      });

      if (response.ok) {
        user = await response.json();
      }
    } catch {
      user = null;
    }
  }

  if (!user?.id) {
    redirect('/login');
  }

  const { data: profile } = await getProfileById(user.id);
  const role = profile?.role ?? user.role ?? 'customer';

  switch (role) {
    case 'admin':
      redirect('/admin/dashboard');
    case 'artisan':
      redirect('/artisan/dashboard');
    default:
      redirect('/customer/dashboard');
  }
}
