import Link from 'next/link';
import { LayoutDashboard, Users, Briefcase, AlertTriangle } from 'lucide-react';

const adminNav = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Users', href: '/admin/users', icon: Users },
  { label: 'Jobs', href: '/admin/jobs', icon: Briefcase },
  { label: 'Disputes', href: '/admin/disputes', icon: AlertTriangle },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex" style={{ background: 'var(--color-bg)' }}>
      <aside
        className="hidden lg:flex flex-col w-64 fixed inset-y-0 left-0 z-30"
        style={{ background: 'var(--color-surface)', borderRight: '1px solid var(--color-border)' }}
      >
        <div className="h-16 flex items-center px-6">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-red-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="text-lg font-bold" style={{ fontFamily: 'var(--font-outfit)' }}>Admin Panel</span>
          </Link>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {adminNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors hover:bg-[var(--color-surface-hover)]"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="flex-1 lg:ml-64">
        <main className="p-6 lg:p-8 max-w-6xl">{children}</main>
      </div>
    </div>
  );
}
