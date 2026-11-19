'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2, Wrench } from 'lucide-react';
import { signIn, signUp } from '@/features/auth/services/auth-service';
import { getAllCategories } from '@/features/search/services/search-service';

const defaultProfessionOptions = [
  { slug: 'plumbing', name: 'Plumbing' },
  { slug: 'electrical', name: 'Electrical' },
  { slug: 'carpentry', name: 'Carpentry' },
  { slug: 'painting', name: 'Painting' },
  { slug: 'cleaning', name: 'Cleaning' },
  { slug: 'ac-refrigeration', name: 'AC & Refrigeration' },
  { slug: 'tiling', name: 'Tiling' },
  { slug: 'welding', name: 'Welding' },
  { slug: 'generator-repair', name: 'Generator Repair' },
  { slug: 'landscaping', name: 'Landscaping' },
];

interface AuthCardProps {
  defaultTab?: 'signin' | 'signup';
  defaultRole?: 'customer' | 'artisan';
}

export function AuthCard({ defaultTab = 'signin', defaultRole = 'customer' }: AuthCardProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>(defaultTab);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sign-in state
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  // Create-account state
  const [role, setRole] = useState<'customer' | 'artisan'>(defaultRole);
  const [categorySlug, setCategorySlug] = useState('');
  const [professions, setProfessions] = useState(defaultProfessionOptions);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');

  useEffect(() => {
    getAllCategories().then(({ data }) => {
      if (Array.isArray(data) && data.length > 0) {
        setProfessions(data.map((c) => ({ slug: c.slug, name: c.name })));
      }
    });
  }, []);

  const inputStyle = {
    background: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    color: 'var(--color-text)',
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await signIn({ email: signInEmail, password: signInPassword });
      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message ?? 'Login failed');
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (role === 'artisan' && !categorySlug) {
      setError('Please select your profession');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      await signUp({
        full_name: fullName,
        phone,
        email: signUpEmail,
        password: signUpPassword,
        role,
        category_slug: role === 'artisan' ? categorySlug : undefined,
      });
      router.push(role === 'artisan' ? '/artisan/dashboard' : '/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message ?? 'Sign-up failed');
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="h-12 w-12 rounded-md gradient-primary flex items-center justify-center text-white mx-auto shadow-card">
          <Wrench className="h-6 w-6" />
        </div>
        <h1
          className="mt-3 text-2xl font-extrabold tracking-tight"
          style={{ fontFamily: 'var(--font-jakarta), var(--font-outfit)' }}
        >
          Welcome to HandyPro Hub
        </h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          Sign in to request services or manage your professional profile.
        </p>
      </div>

      {/* Card */}
      <div
        className="rounded-md p-6 shadow-card"
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
        }}
      >
        {/* Tabs */}
        <div
          role="tablist"
          className="grid w-full grid-cols-2 h-9 p-1 rounded-md"
          style={{ background: 'var(--color-bg-secondary)' }}
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'signin'}
            onClick={() => {
              setActiveTab('signin');
              setError(null);
            }}
            className="rounded-md text-xs font-semibold transition-all"
            style={{
              background: activeTab === 'signin' ? 'var(--color-surface)' : 'transparent',
              color: activeTab === 'signin' ? 'var(--color-text)' : 'var(--color-text-secondary)',
              boxShadow: activeTab === 'signin' ? 'var(--shadow-sm)' : 'none',
            }}
          >
            Sign in
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'signup'}
            onClick={() => {
              setActiveTab('signup');
              setError(null);
            }}
            className="rounded-md text-xs font-semibold transition-all"
            style={{
              background: activeTab === 'signup' ? 'var(--color-surface)' : 'transparent',
              color: activeTab === 'signup' ? 'var(--color-text)' : 'var(--color-text-secondary)',
              boxShadow: activeTab === 'signup' ? 'var(--shadow-sm)' : 'none',
            }}
          >
            Create account
          </button>
        </div>

        {error && (
          <div
            className="mt-4 rounded-md p-3 text-xs font-medium"
            style={{
              background: 'rgba(239,68,68,0.1)',
              color: '#EF4444',
              border: '1px solid rgba(239,68,68,0.2)',
            }}
          >
            {error}
          </div>
        )}

        {/* Forms */}
        {activeTab === 'signin' ? (
          <form onSubmit={handleSignIn} className="mt-4 space-y-4">
            <div>
              <label htmlFor="si-email" className="block text-xs font-medium">
                Email
              </label>
              <input
                id="si-email"
                name="email"
                type="email"
                required
                value={signInEmail}
                onChange={(e) => setSignInEmail(e.target.value)}
                className="mt-1.5 w-full h-9 rounded-md px-3 py-1 text-sm shadow-sm outline-none"
                style={inputStyle}
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="si-password" className="block text-xs font-medium">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-medium"
                  style={{ color: 'var(--color-primary)' }}
                >
                  Forgot password?
                </Link>
              </div>
              <input
                id="si-password"
                name="password"
                type="password"
                required
                value={signInPassword}
                onChange={(e) => setSignInPassword(e.target.value)}
                className="mt-1.5 w-full h-9 rounded-md px-3 py-1 text-sm shadow-sm outline-none"
                style={inputStyle}
              />
            </div>

            <button
              id="login-submit"
              type="submit"
              disabled={isLoading}
              className="w-full h-10 rounded-md px-4 py-2 text-sm font-semibold text-white gradient-primary shadow-sm flex items-center justify-center gap-2 transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Sign in'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignUp} className="mt-4 space-y-4">
            <div>
              <label className="block text-xs font-medium mb-1.5">Account type</label>
              <div className="grid grid-cols-2 gap-2">
                {(['customer', 'artisan'] as const).map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      setRole(option);
                      setError(null);
                    }}
                    className="h-9 rounded-md text-xs font-semibold capitalize transition-all"
                    style={{
                      background: role === option ? 'var(--color-primary-50)' : 'var(--color-surface)',
                      color: role === option ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                      border: `1px solid ${role === option ? 'var(--color-primary)' : 'var(--color-border)'}`,
                    }}
                  >
                    {option === 'customer' ? 'Customer' : 'Professional'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="su-name" className="block text-xs font-medium">
                Full name
              </label>
              <input
                id="su-name"
                name="full_name"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="mt-1.5 w-full h-9 rounded-md px-3 py-1 text-sm shadow-sm outline-none"
                style={inputStyle}
              />
            </div>

            {role === 'artisan' && (
              <div>
                <label htmlFor="su-profession" className="block text-xs font-medium">
                  Profession *
                </label>
                <select
                  id="su-profession"
                  name="category_slug"
                  required
                  value={categorySlug}
                  onChange={(e) => setCategorySlug(e.target.value)}
                  className="mt-1.5 w-full h-9 rounded-md px-3 py-1 text-sm shadow-sm outline-none"
                  style={inputStyle}
                >
                  <option value="">Select your profession</option>
                  {professions.map((prof) => (
                    <option key={prof.slug} value={prof.slug}>
                      {prof.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label htmlFor="su-phone" className="block text-xs font-medium">
                Phone number
              </label>
              <input
                id="su-phone"
                name="phone"
                type="tel"
                required
                placeholder="080..."
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1.5 w-full h-9 rounded-md px-3 py-1 text-sm shadow-sm outline-none"
                style={inputStyle}
              />
            </div>

            <div>
              <label htmlFor="su-email" className="block text-xs font-medium">
                Email
              </label>
              <input
                id="su-email"
                name="email"
                type="email"
                required
                value={signUpEmail}
                onChange={(e) => setSignUpEmail(e.target.value)}
                className="mt-1.5 w-full h-9 rounded-md px-3 py-1 text-sm shadow-sm outline-none"
                style={inputStyle}
              />
            </div>

            <div>
              <label htmlFor="su-password" className="block text-xs font-medium">
                Password
              </label>
              <input
                id="su-password"
                name="password"
                type="password"
                minLength={6}
                required
                value={signUpPassword}
                onChange={(e) => setSignUpPassword(e.target.value)}
                className="mt-1.5 w-full h-9 rounded-md px-3 py-1 text-sm shadow-sm outline-none"
                style={inputStyle}
              />
            </div>

            <button
              id="register-submit"
              type="submit"
              disabled={isLoading}
              className="w-full h-10 rounded-md px-4 py-2 text-sm font-semibold text-white gradient-primary shadow-sm flex items-center justify-center gap-2 transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create account'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
