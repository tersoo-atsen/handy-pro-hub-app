'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Mail, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/callback?type=recovery`,
    });

    if (error) {
      setError(error.message);
    } else {
      setIsSent(true);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8" style={{ background: 'var(--color-bg)' }}>
      <div className="w-full max-w-md">
        <Link href="/login" className="inline-flex items-center gap-2 text-sm mb-8" style={{ color: 'var(--color-text-secondary)' }}>
          <ArrowLeft className="h-4 w-4" /> Back to login
        </Link>

        {isSent ? (
          <div className="text-center animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6" style={{ background: 'rgba(16,185,129,0.1)' }}>
              <CheckCircle className="h-8 w-8" style={{ color: 'var(--color-accent)' }} />
            </div>
            <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: 'var(--font-outfit)' }}>Check Your Email</h2>
            <p style={{ color: 'var(--color-text-secondary)' }}>We sent a password reset link to <strong>{email}</strong></p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: 'var(--font-outfit)' }}>Reset Password</h2>
            <p className="mb-8" style={{ color: 'var(--color-text-secondary)' }}>Enter your email and we&apos;ll send you a reset link</p>

            {error && (
              <div className="mb-6 rounded-lg p-4 text-sm" style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444' }}>{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5" style={{ color: 'var(--color-text-tertiary)' }} />
                  <input
                    id="reset-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full rounded-xl pl-11 pr-4 py-3 text-sm outline-none"
                    style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white gradient-primary disabled:opacity-60"
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Send Reset Link'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
