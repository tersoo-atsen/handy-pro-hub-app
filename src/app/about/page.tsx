import Link from 'next/link';
import { ArrowRight, ShieldCheck, Star, Users } from 'lucide-react';
import { PublicNavbar } from '@/components/public-navbar';
import { PublicFooter } from '@/components/public-footer';

const values = [
  {
    title: 'Trust & Verification',
    description: 'Every artisan profile is reviewed for identity and trade skills so households can hire with peace of mind.',
    icon: ShieldCheck,
  },
  {
    title: 'Fair & Transparent Bidding',
    description: 'Customers compare clear proposals and ratings up front, while skilled professionals compete on quality.',
    icon: Star,
  },
  {
    title: 'Local Economic Growth',
    description: 'Empowering technicians and craftspeople in Makurdi, Benue State and across Nigeria to grow their business.',
    icon: Users,
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--color-bg)' }}>
      <PublicNavbar />

      <main className="flex-1 mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8 py-14 space-y-12">
        <div className="space-y-4 max-w-3xl">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            About HandyPro <span style={{ color: 'var(--color-primary)' }}>Hub</span>
          </h1>
          <p className="text-base leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
            HandyPro Hub connects homeowners, offices, and businesses in Makurdi with reliable, verified artisans and technicians — from emergency plumbing and electrical repairs to carpentry, tiling, and AC servicing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {values.map((item) => (
            <div
              key={item.title}
              className="rounded-md p-6 space-y-3 shadow-card"
              style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border-light)',
              }}
            >
              <div
                className="h-10 w-10 rounded-full flex items-center justify-center"
                style={{ background: 'var(--color-brand-blue-soft)', color: 'var(--color-brand-blue)' }}
              >
                <item.icon className="h-5 w-5" />
              </div>
              <h2 className="text-base font-bold">{item.title}</h2>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                {item.description}
              </p>
            </div>
          ))}
        </div>

        <div
          className="rounded-md p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-card"
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border-light)',
          }}
        >
          <div className="space-y-1">
            <h2 className="text-lg font-bold">Are you a skilled professional?</h2>
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              Join HandyPro Hub to discover nearby jobs, submit bids, and build your verified reputation.
            </p>
          </div>
          <Link
            href="/register/artisan"
            className="inline-flex items-center justify-center gap-2 rounded-md px-5 py-2.5 text-sm font-semibold text-white shrink-0"
            style={{ backgroundColor: 'var(--color-brand-blue)' }}
          >
            Become a Professional
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
