'use client';
import { Briefcase, Clock, Star, TrendingUp, Loader2 } from 'lucide-react';
import { useUser } from '@/hooks/use-user';
import { useSupabase } from '@/providers/supabase-provider';
import { useState } from 'react';

const quickStats = [
  { label: 'Active Jobs', value: '0', icon: Briefcase, color: 'var(--color-primary)' },
  { label: 'Pending Bids', value: '0', icon: Clock, color: '#F59E0B' },
  { label: 'Completed', value: '0', icon: Star, color: 'var(--color-accent)' },
  { label: 'Total Spent', value: '₦0', icon: TrendingUp, color: '#8B5CF6' },
];

export default function CustomerDashboard() {
  const { profile, isLoading } = useUser();
  const { supabase } = useSupabase();
  const [upgrading, setUpgrading] = useState(false);

  const handleUpgrade = async () => {
    if (!profile) return;
    setUpgrading(true);
    const { error } = await supabase
      .from('profiles')
      .update({ role: 'artisan' })
      .eq('id', profile.id);
    if (!error) {
      await supabase.from('artisan_profiles').upsert({ user_id: profile.id });
      window.location.href = '/artisan/onboarding'; // or '/artisan/dashboard'
    }
    setUpgrading(false);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-outfit)' }}>Dashboard</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>Welcome back! Here&apos;s your overview.</p>
      </div>

      {/* Upgrade banner */}
      {profile && profile.role !== 'artisan' && (
        <div className="rounded-2xl p-6 mb-6 bg-gradient-primary text-white shadow-md">
          <h2 className="text-lg font-semibold">Become a Pro Artisan</h2>
          <p className="mt-2">Unlock job bidding, set rates, and grow your business.</p>
          <button
            onClick={handleUpgrade}
            disabled={upgrading}
            className="mt-4 w-full rounded-xl py-2 font-semibold text-white gradient-primary hover:scale-105 transition-transform flex items-center justify-center"
          >
            {upgrading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Upgrade Now'}
          </button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl p-5 transition-all hover:scale-[1.02]"
            style={{ background: 'var(--color-surface)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border-light)' }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ background: `${stat.color}15` }}>
                <stat.icon className="h-5 w-5" style={{ color: stat.color }} />
              </div>
            </div>
            <p className="text-2xl font-bold" style={{ fontFamily: 'var(--font-outfit)' }}>{stat.value}</p>
            <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Empty state */}
      <div
        className="rounded-2xl p-12 text-center"
        style={{ background: 'var(--color-surface)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border-light)' }}
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ background: 'var(--color-primary-50)' }}>
          <Briefcase className="h-8 w-8" style={{ color: 'var(--color-primary)' }} />
        </div>
        <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: 'var(--font-outfit)' }}>No active jobs</h3>
        <p className="mb-6" style={{ color: 'var(--color-text-secondary)' }}>Post your first job request to get started with Handy Pro</p>
        <a
          href="/customer/jobs/new"
          className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white gradient-primary hover:scale-105 transition-transform"
        >
          Post a Job Request
        </a>
      </div>
    </div>
  );
}
