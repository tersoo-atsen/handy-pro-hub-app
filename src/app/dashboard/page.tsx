import { createClient } from '@/lib/supabase/server';
import { getProfileById } from '@/features/profiles/services/profile-service';
import { redirect } from 'next/navigation';

export default async function DashboardRedirect() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch the user's role from the backend profiles endpoint
  const { data: profile } = await getProfileById(user.id);

  const role = profile?.role ?? 'customer';

  switch (role) {
    case 'admin':
      redirect('/admin/dashboard');
    case 'artisan':
      redirect('/artisan/dashboard');
    default:
      redirect('/customer/dashboard');
  }
}
