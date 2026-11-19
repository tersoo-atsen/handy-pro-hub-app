import Link from 'next/link';
import { Home, Briefcase, Calendar, MessageSquare, Search } from 'lucide-react';
import { NotificationBell } from '@/features/notifications/components/notification-bell';
import { CustomerAvatarMenu } from '@/features/profiles/components/customer-avatar-menu';
import { NavLink } from '@/components/nav-link';

const customerNav = [
  { label: 'Dashboard', href: '/customer/dashboard', icon: Home },
  { label: 'Search', href: '/customer/search', icon: Search },
  { label: 'My Jobs', href: '/customer/jobs', icon: Briefcase },
  { label: 'Bookings', href: '/customer/bookings', icon: Calendar },
  { label: 'Messages', href: '/customer/messages', icon: MessageSquare },
];

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--color-bg)' }}>
      {/* Top navbar */}
      <header
        className="sticky top-0 z-40 h-16 flex items-center px-4 sm:px-6 gap-2 sm:gap-3 lg:gap-4"
        style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}
      >
        <Link href="/customer/dashboard" className="flex items-center gap-2 shrink-0">
          <div className="h-8 w-8 rounded-md gradient-primary flex items-center justify-center">
            <span className="font-bold text-sm">H</span>
          </div>
          <span className="text-lg font-bold hidden sm:inline" style={{ fontFamily: 'var(--font-outfit)' }}>
            Handy<span className="text-gradient">Pro</span>
          </span>
        </Link>
        <div className="flex-1" />
        <nav className="hidden md:flex items-center gap-0.5 lg:gap-1">
          {customerNav.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              className="flex items-center gap-1.5 lg:gap-2 px-2.5 lg:px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors hover:bg-[var(--color-surface-hover)]"
              style={{ color: 'var(--color-text-secondary)' }}
              activeStyle={{ backgroundColor: 'var(--color-primary-50)' }}
              activeClassName="font-semibold"
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-2 shrink-0">
          <NotificationBell />
          <CustomerAvatarMenu />
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 min-w-0 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 pb-24 md:py-8">
        {children}
      </main>

      {/* Mobile bottom nav */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around py-2 px-1"
        style={{ background: 'var(--color-surface)', borderTop: '1px solid var(--color-border)', boxShadow: 'var(--shadow-lg)' }}
      >
        {customerNav.slice(0, 5).map((item) => (
          <NavLink
            key={item.href}
            href={item.href}
            className="flex flex-col items-center gap-1 px-2 py-1 text-[11px] sm:text-xs whitespace-nowrap"
            style={{ color: 'var(--color-text-secondary)' }}
            activeClassName="font-semibold"
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
