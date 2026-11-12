import Link from 'next/link';
import { LayoutDashboard, MapPin, Gavel, Calendar, MessageSquare, User, Clock } from 'lucide-react';

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
        <div className="h-16 flex items-center px-6">
          <Link href="/artisan/dashboard" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
              <span className="text-white font-bold text-sm">H</span>
            </div>
            <span className="text-lg font-bold" style={{ fontFamily: 'var(--font-outfit)' }}>
              Handy<span className="text-gradient">Pro</span>
            </span>
          </Link>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {artisanNav.map((item) => (
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
        <div className="p-4" style={{ borderTop: '1px solid var(--color-border)' }}>
          <div
            className="rounded-xl p-4 text-center text-sm"
            style={{ background: 'var(--color-primary-50)' }}
          >
            <p className="font-medium" style={{ color: 'var(--color-primary)' }}>Pro Artisan</p>
            <p className="mt-1" style={{ color: 'var(--color-text-secondary)' }}>Verified Account</p>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 lg:ml-64">
        {/* Top bar on mobile */}
        <header
          className="lg:hidden sticky top-0 z-40 h-16 flex items-center px-4"
          style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}
        >
          <Link href="/artisan/dashboard" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
              <span className="text-white font-bold text-sm">H</span>
            </div>
            <span className="text-lg font-bold" style={{ fontFamily: 'var(--font-outfit)' }}>
              Handy<span className="text-gradient">Pro</span>
            </span>
          </Link>
        </header>

        <main className="p-6 lg:p-8 max-w-6xl">
          {children}
        </main>

        {/* Mobile bottom nav */}
        <nav
          className="lg:hidden fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around py-2"
          style={{ background: 'var(--color-surface)', borderTop: '1px solid var(--color-border)' }}
        >
          {artisanNav.slice(0, 5).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-1 px-3 py-1 text-xs"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
