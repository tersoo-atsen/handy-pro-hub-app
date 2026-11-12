'use client';

import Link from 'next/link';
import { Wrench, ArrowLeft } from 'lucide-react';

export default function ArtisanRegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8" style={{ background: 'var(--color-bg)' }}>
      <div className="w-full max-w-lg text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary mb-6">
          <Wrench className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-outfit)' }}>
          Join as a <span className="text-gradient">Pro Artisan</span>
        </h1>
        <p className="text-lg mb-8" style={{ color: 'var(--color-text-secondary)' }}>
          Showcase your skills, receive job requests, and grow your business with Handy Pro.
        </p>
        <div
          className="rounded-2xl p-8 text-left mb-6"
          style={{
            background: 'var(--color-surface)',
            boxShadow: 'var(--shadow-md)',
            border: '1px solid var(--color-border-light)'
          }}
        >
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            Artisan onboarding flow coming soon. First, create a regular account and then upgrade to artisan from your profile.
          </p>
        </div>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white gradient-primary"
          >
            Create Account First
          </Link>
          <Link href="/" className="inline-flex items-center gap-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
