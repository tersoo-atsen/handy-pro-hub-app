import Link from 'next/link';
import { LayoutDashboard, MapPin, Gavel, Calendar, MessageSquare, User, Clock } from 'lucide-react';
import { NotificationBell } from '@/features/notifications/components/notification-bell';
import { ArtisanSidebarAccount } from '@/features/artisans/components/artisan-sidebar-account';
import { ArtisanAvatarMenu } from '@/features/artisans/components/artisan-avatar-menu';
import { NavLink } from '@/components/nav-link';

const artisanNav = [
  { label: 'Dashboard', href: '/artisan/dashboard', icon: LayoutDashboard },
  { label: 'Nearby Jobs', href: '/artisan/jobs', icon: MapPin },
  { label: 'My Bids', href: '/artisan/bids', icon: Gavel },
  { label: 'Bookings', href: '/artisan/bookings', icon: Calendar },
  { label: 'Messages', href: '/artisan/messages', icon: MessageSquare },
  { label: 'Availability', href: '/artisan/availability', icon: Clock },
  { label: 'Profile', href: '/artisan/profile', icon: User },
];

export default function ArtisanLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex" style={{ background: 'var(--color-bg)' }}>
      {/* Sidebar */}
      <aside
        className="hidden lg:flex flex-col w-64 fixed inset-y-0 left-0 z-30"
        style={{ background: 'var(--color-surface)', borderRight: '1px solid var(--color-border)' }}
      >
        <div className="h-16 flex items-center justify-between px-6">
          <Link href="/artisan/dashboard" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md gradient-primary flex items-center justify-center">
              <span className="font-bold text-sm">H</span>
            </div>
            <span className="text-lg font-bold" style={{ fontFamily: 'var(--font-outfit)' }}>
              Handy<span className="text-gradient">Pro</span>
            </span>
          </Link>
          <NotificationBell align="left" />
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {artisanNav.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors hover:bg-(--color-surface-hover)"
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
          <ArtisanSidebarAccount />
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0 lg:ml-64">
        {/* Top bar on mobile */}
        <header
          className="lg:hidden sticky top-0 z-40 h-16 flex items-center justify-between px-4"
          style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}
        >
          <Link href="/artisan/dashboard" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md gradient-primary flex items-center justify-center">
              <span className="font-bold text-sm">H</span>
            </div>
            <span className="text-lg font-bold" style={{ fontFamily: 'var(--font-outfit)' }}>
              Handy<span className="text-gradient">Pro</span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <NotificationBell />
            <ArtisanAvatarMenu />
          </div>
        </header>

        <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24 lg:py-8">
          {children}
        </main>

        {/* Mobile bottom nav */}
        <nav
          className="lg:hidden fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around py-2"
          style={{ background: 'var(--color-surface)', borderTop: '1px solid var(--color-border)' }}
        >
          {artisanNav.slice(0, 5).map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-1 px-3 py-1 text-xs"
              style={{ color: 'var(--color-text-secondary)' }}
              activeClassName="font-semibold"
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}
