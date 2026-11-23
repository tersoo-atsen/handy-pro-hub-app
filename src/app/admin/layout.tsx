import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { LayoutDashboard, Users, Briefcase, AlertTriangle } from 'lucide-react';
import { NavLink } from '@/components/nav-link';
import { AdminSidebarAccount } from '@/features/admin/components/admin-sidebar-account';

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:5000').trim();

const adminNav = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Users', href: '/admin/users', icon: Users },
  { label: 'Jobs', href: '/admin/jobs', icon: Briefcase },
  { label: 'Disputes', href: '/admin/disputes', icon: AlertTriangle },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value;
  if (!accessToken) {
    redirect('/login');
  }

  let role: string | undefined;
  try {
    const res = await fetch(`${API_BASE}/auth/me`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Cookie: cookieStore.toString(),
      },
      cache: 'no-store',
    });
    if (res.ok) {
      const user = await res.json();
      role = user?.role;
    }
  } catch {
    role = undefined;
  }

  if (!role) {
    redirect('/login');
  }

  if (role !== 'admin') {
    redirect(role === 'artisan' ? '/artisan/dashboard' : '/customer/dashboard');
  }

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--color-bg)' }}>
      <aside
        className="hidden lg:flex flex-col w-64 fixed inset-y-0 left-0 z-30"
        style={{ background: 'var(--color-surface)', borderRight: '1px solid var(--color-border)' }}
      >
        <div className="h-16 flex items-center px-6">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-red-600 flex items-center justify-center">
              <span className="font-bold text-sm" style={{ color: 'var(--color-text-inverse)' }}>A</span>
            </div>
            <span className="text-lg font-bold" style={{ fontFamily: 'var(--font-outfit)' }}>Admin Panel</span>
          </Link>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {adminNav.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors hover:bg-[var(--color-surface-hover)]"
              style={{ color: 'var(--color-text-secondary)' }}
              activeStyle={{ backgroundColor: 'var(--color-primary-50)' }}
              activeClassName="font-semibold"
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3" style={{ borderTop: '1px solid var(--color-border)' }}>
          <AdminSidebarAccount />
        </div>
      </aside>
      <div className="flex-1 lg:ml-64">
        <main className="p-6 lg:p-8 max-w-6xl">{children}</main>
      </div>
    </div>
  );
}
