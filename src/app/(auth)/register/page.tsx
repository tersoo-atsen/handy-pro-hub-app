'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Phone,
  ArrowRight,
  Loader2,
} from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    confirm_password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    const { error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: formData.full_name,
          phone: formData.phone,
          role: 'customer',
        },
      },
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
    } else {
      router.push('/dashboard');
      router.refresh();
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
            Join Handy Pro
          </h1>
          <p className="text-white/70 text-lg max-w-md">
            Create an account to find skilled artisans near you and get your jobs done.
          </p>
        </div>
      </div>

      {/* Right side - form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: 'var(--font-outfit)' }}>Create Account</h2>
          <p className="mb-8" style={{ color: 'var(--color-text-secondary)' }}>Sign up as a customer to get started</p>

          {error && (
            <div className="mb-6 rounded-lg p-4 text-sm" style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.2)' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5" style={{ color: 'var(--color-text-tertiary)' }} />
                <input
                  id="register-name"
                  name="full_name"
                  type="text"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                  className="w-full rounded-xl pl-11 pr-4 py-3 text-sm outline-none"
                  style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5" style={{ color: 'var(--color-text-tertiary)' }} />
                <input
                  id="register-email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  className="w-full rounded-xl pl-11 pr-4 py-3 text-sm outline-none"
                  style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Phone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5" style={{ color: 'var(--color-text-tertiary)' }} />
                <input
                  id="register-phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+234 800 000 0000"
                  className="w-full rounded-xl pl-11 pr-4 py-3 text-sm outline-none"
                  style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5" style={{ color: 'var(--color-text-tertiary)' }} />
                <input
                  id="register-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min. 8 characters"
                  required
                  minLength={8}
                  className="w-full rounded-xl pl-11 pr-12 py-3 text-sm outline-none"
                  style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-tertiary)' }}>
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5" style={{ color: 'var(--color-text-tertiary)' }} />
                <input
                  id="register-confirm-password"
                  name="confirm_password"
                  type="password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  placeholder="Repeat password"
                  required
                  className="w-full rounded-xl pl-11 pr-4 py-3 text-sm outline-none"
                  style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
                />
              </div>
            </div>

            <button
              id="register-submit"
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white transition-all hover:scale-[1.02] gradient-primary disabled:opacity-60"
              style={{ boxShadow: 'var(--shadow-md)' }}
            >
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <><ArrowRight className="h-4 w-4" /> Create Account</>}
            </button>
          </form>

          <p className="mt-6 text-center text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            Already have an account?{' '}
            <Link href="/login" className="font-semibold" style={{ color: 'var(--color-primary)' }}>Sign in</Link>
          </p>

          <div className="mt-4 text-center">
            <Link href="/login" className="text-sm font-medium" style={{ color: 'var(--color-primary)' }}>
              Want to join as an Artisan? →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
