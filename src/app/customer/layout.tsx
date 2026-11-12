import Link from 'next/link';
import { Home, Briefcase, Calendar, MessageSquare, User, Search } from 'lucide-react';

const customerNav = [
  { label: 'Dashboard', href: '/customer/dashboard', icon: Home },
  { label: 'Search', href: '/customer/search', icon: Search },
  { label: 'My Jobs', href: '/customer/jobs', icon: Briefcase },
  { label: 'Bookings', href: '/customer/bookings', icon: Calendar },
  { label: 'Messages', href: '/customer/messages', icon: MessageSquare },
  { label: 'Profile', href: '/customer/profile', icon: User },
];

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--color-bg)' }}>
      {/* Top navbar */}
      <header
        className="sticky top-0 z-40 h-16 flex items-center px-6 gap-4"
        style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}
      >
        <Link href="/customer/dashboard" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
            <span className="text-white font-bold text-sm">H</span>
          </div>
          <span className="text-lg font-bold hidden sm:inline" style={{ fontFamily: 'var(--font-outfit)' }}>
            Handy<span className="text-gradient">Pro</span>
          </span>
        </Link>
        <div className="flex-1" />
        <nav className="hidden md:flex items-center gap-1">
          {customerNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-[var(--color-surface-hover)]"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      {/* Main content */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Mobile bottom nav */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around py-2"
        style={{ background: 'var(--color-surface)', borderTop: '1px solid var(--color-border)', boxShadow: 'var(--shadow-lg)' }}
      >
        {customerNav.slice(0, 5).map((item) => (
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
  );
}
