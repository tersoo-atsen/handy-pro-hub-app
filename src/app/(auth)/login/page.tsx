'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from '@/features/auth/services/auth-service';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  // const supabase = createClient(); // Deprecated – using auth‑service
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await signIn({ email, password });
      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message ?? 'Login failed');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--color-bg)' }}>
      {/* Left side - branding */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
        <div className="relative z-10 text-center">
          <div className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-6">
            <span className="text-white font-bold text-2xl">H</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-outfit)' }}>
            Welcome Back
          </h1>
          <p className="text-white/70 text-lg max-w-md">
            Sign in to manage your jobs, track artisans, and get things done.
          </p>
        </div>
      </div>

      {/* Right side - form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 text-center">
            <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-lg">H</span>
            </div>
            <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-outfit)' }}>
              Handy<span className="text-gradient">Pro</span>
            </h1>
          </div>

          <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: 'var(--font-outfit)' }}>
            Sign In
          </h2>
          <p className="mb-8" style={{ color: 'var(--color-text-secondary)' }}>
            Enter your credentials to access your account
          </p>

          {error && (
            <div className="mb-6 rounded-lg p-4 text-sm" style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.2)' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5" style={{ color: 'var(--color-text-tertiary)' }} />
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full rounded-xl pl-11 pr-4 py-3 text-sm outline-none transition-all"
                  style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5" style={{ color: 'var(--color-text-tertiary)' }} />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-xl pl-11 pr-12 py-3 text-sm outline-none transition-all"
                  style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--color-text-tertiary)' }}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" className="rounded" />
                Remember me
              </label>
              <Link href="/forgot-password" className="text-sm font-medium" style={{ color: 'var(--color-primary)' }}>
                Forgot password?
              </Link>
            </div>

            <button
              id="login-submit"
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white transition-all hover:scale-[1.02] gradient-primary disabled:opacity-60"
              style={{ boxShadow: 'var(--shadow-md)' }}
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            Don&apos;t have an account?{' '}
            <Link href="/register" className="font-semibold" style={{ color: 'var(--color-primary)' }}>
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
