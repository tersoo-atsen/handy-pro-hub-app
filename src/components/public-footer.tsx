import Link from 'next/link';
import { Wrench, MapPin } from 'lucide-react';

export function PublicFooter() {
  return (
    <footer
      style={{
        background: 'var(--color-surface)',
        borderTop: '1px solid var(--color-border)',
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Summary */}
          <div className="space-y-3">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-md gradient-primary flex items-center justify-center text-white">
                <Wrench className="h-4 w-4" />
              </div>
              <span className="text-base font-extrabold tracking-tight">
                HandyPro <span style={{ color: 'var(--color-primary)' }}>Hub</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
              Connecting households and businesses with verified artisans and technicians. Serving Makurdi, Benue State and expanding across Nigeria.
            </p>
          </div>

          {/* Platform */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold">Platform</h4>
            <ul className="space-y-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              <li>
                <Link href="/services" className="hover:underline">Services</Link>
              </li>
              <li>
                <Link href="/professionals" className="hover:underline">Find a Professional</Link>
              </li>
              <li>
                <Link href="/customer/jobs/new" className="hover:underline">Request a Service</Link>
              </li>
              <li>
                <Link href="/register/artisan" className="hover:underline">Become a Professional</Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold">Company</h4>
            <ul className="space-y-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              <li>
                <Link href="/about" className="hover:underline">About Us</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:underline">Contact</Link>
              </li>
              <li>
                <Link href="/login" className="hover:underline">Sign In</Link>
              </li>
              <li>
                <Link href="/register" className="hover:underline">Create Account</Link>
              </li>
            </ul>
          </div>

          {/* Get in touch */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold">Get in Touch</h4>
            <div className="space-y-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              <p className="inline-flex items-center gap-1.5">
                <MapPin className="h-4 w-4 shrink-0" style={{ color: 'var(--color-primary)' }} />
                Makurdi, Benue State, Nigeria
              </p>
              <p>Mon – Sat, 8:00am – 6:00pm</p>
            </div>
          </div>
        </div>

        <div
          className="mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs"
          style={{
            borderTop: '1px solid var(--color-border-light)',
            color: 'var(--color-text-tertiary)',
          }}
        >
          <p>© {new Date().getFullYear()} HandyPro Hub. All rights reserved.</p>
          <p>Trusted home &amp; commercial services across Nigeria.</p>
        </div>
      </div>
    </footer>
  );
}
