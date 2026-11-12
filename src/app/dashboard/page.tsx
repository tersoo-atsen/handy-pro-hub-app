import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function DashboardRedirect() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch the user's role from the profiles table
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

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
