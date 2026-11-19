'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Wrench } from 'lucide-react';
import { useUser } from '@/hooks/use-user';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'Find a Pro', href: '/professionals' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export function PublicNavbar() {
  const pathname = usePathname();
  const { profile } = useUser();
  const [mobileOpen, setMobileOpen] = useState(false);

  const dashboardHref =
    profile?.role === 'admin'
      ? '/admin/dashboard'
      : profile?.role === 'artisan'
        ? '/artisan/dashboard'
        : '/customer/dashboard';

  return (
    <header
      className="sticky top-0 z-50 h-16 backdrop-blur"
      style={{
        background: 'rgba(252, 252, 252, 0.95)',
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      <div className="mx-auto max-w-7xl h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="h-9 w-9 rounded-md gradient-primary flex items-center justify-center text-white">
            <Wrench className="h-4 w-4" />
          </div>
          <span
            className="text-lg font-extrabold tracking-tight"
            style={{ fontFamily: 'var(--font-jakarta), var(--font-outfit)' }}
          >
            HandyPro <span style={{ color: 'var(--color-primary)' }}>Hub</span>
          </span>
        </Link>

        {/* Center Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((item) => {
            const isActive =
              item.href === '/'
                ? pathname === '/'
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className="px-3.5 py-2 rounded-md text-sm font-medium transition-colors"
                style={{
                  background: isActive ? 'var(--color-primary-50)' : 'transparent',
                  color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="hidden md:flex items-center gap-2.5 shrink-0">
          {profile ? (
            <Link
              href={dashboardHref}
              className="rounded-md px-4 py-2 text-sm font-semibold text-white gradient-primary transition-transform hover:scale-[1.02]"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-[var(--color-surface-hover)]"
                style={{ color: 'var(--color-text)' }}
              >
                Sign in
              </Link>
              <Link
                href="/register/artisan"
                className="rounded-md px-3.5 py-2 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
                style={{ backgroundColor: 'var(--color-brand-blue)' }}
              >
                Become a Professional
              </Link>
              <Link
                href="/professionals"
                className="rounded-md px-3.5 py-2 text-sm font-semibold text-white gradient-primary transition-transform hover:scale-[1.02]"
              >
                Find a Professional
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="md:hidden h-9 w-9 rounded-md flex items-center justify-center"
          style={{
            border: '1px solid var(--color-border)',
            color: 'var(--color-text)',
          }}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div
          className="md:hidden px-4 py-4 space-y-2 shadow-lg"
          style={{
            background: 'var(--color-surface)',
            borderBottom: '1px solid var(--color-border)',
          }}
        >
          {navLinks.map((item) => {
            const isActive =
              item.href === '/'
                ? pathname === '/'
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 rounded-md text-sm font-medium"
                style={{
                  background: isActive ? 'var(--color-primary-50)' : 'transparent',
                  color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                }}
              >
                {item.label}
              </Link>
            );
          })}
          <div className="pt-2 flex flex-col gap-2" style={{ borderTop: '1px solid var(--color-border-light)' }}>
            {profile ? (
              <Link
                href={dashboardHref}
                onClick={() => setMobileOpen(false)}
                className="w-full text-center rounded-md py-2.5 text-sm font-semibold text-white gradient-primary"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="w-full text-center rounded-md py-2.5 text-sm font-medium"
                  style={{ border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
                >
                  Sign in
                </Link>
                <Link
                  href="/register/artisan"
                  onClick={() => setMobileOpen(false)}
                  className="w-full text-center rounded-md py-2.5 text-sm font-semibold text-white"
                  style={{ backgroundColor: 'var(--color-brand-blue)' }}
                >
                  Become a Professional
                </Link>
                <Link
                  href="/professionals"
                  onClick={() => setMobileOpen(false)}
                  className="w-full text-center rounded-md py-2.5 text-sm font-semibold text-white gradient-primary"
                >
                  Find a Professional
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
