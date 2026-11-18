'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Briefcase, Clock, Star, TrendingUp, Plus, MapPin, DollarSign, Loader2 } from 'lucide-react';
import { useUser } from '@/hooks/use-user';
import { getMyJobs } from '@/features/jobs/services/job-service';
import { getMyBookings } from '@/features/bookings/services/booking-service';
import type { JobRequest } from '@/features/jobs/types';

export default function CustomerDashboard() {
  const { profile, isLoading } = useUser();
  const [jobs, setJobs] = useState<JobRequest[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!profile?.id) {
      if (!isLoading) setLoadingData(false);
      return;
    }
    setLoadingData(true);
    Promise.all([getMyJobs(profile.id), getMyBookings(profile.id)])
      .then(([jobsRes, bookingsRes]) => {
        setJobs(jobsRes.data ?? []);
        setBookings(bookingsRes.data ?? []);
      })
      .finally(() => {
        setLoadingData(false);
      });
  }, [profile?.id, isLoading]);

  if (isLoading) return <div>Loading...</div>;

  const activeJobs = jobs.filter((j) =>
    ['open', 'bidding', 'assigned', 'in_progress'].includes(j.status)
  );
  const pendingBidsCount = activeJobs.reduce(
    (sum, j) => sum + Number(j.bid_count ?? 0),
    0
  );
  const completedCount = bookings.filter((b) => b.status === 'completed').length;
  const totalSpent = bookings
    .filter((b) => b.status === 'completed')
    .reduce((sum, b) => sum + Number(b.agreed_amount ?? 0), 0);

  const quickStats = [
    { label: 'Active Jobs', value: String(activeJobs.length), icon: Briefcase, color: 'var(--color-primary)', href: '/customer/jobs' },
    { label: 'Pending Bids', value: String(pendingBidsCount), icon: Clock, color: '#F59E0B', href: '/customer/jobs' },
    { label: 'Completed', value: String(completedCount), icon: Star, color: 'var(--color-accent)', href: '/customer/bookings' },
    { label: 'Total Spent', value: `₦${totalSpent.toLocaleString()}`, icon: TrendingUp, color: '#8B5CF6', href: '/customer/bookings' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-outfit)' }}>
          Dashboard
        </h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          Welcome back{profile?.full_name ? `, ${profile.full_name}` : ''}! Here&apos;s your overview.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="rounded-md p-5 transition-all hover:scale-[1.02] block"
            style={{ background: 'var(--color-surface)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border-light)' }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="h-10 w-10 rounded-md flex items-center justify-center" style={{ background: `${stat.color}15` }}>
                <stat.icon className="h-5 w-5" style={{ color: stat.color }} />
              </div>
            </div>
            <p className="text-2xl font-bold" style={{ fontFamily: 'var(--font-outfit)' }}>{stat.value}</p>
            <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>{stat.label}</p>
          </Link>
        ))}
      </div>

      {/* Active Jobs or Empty state */}
      {loadingData ? (
        <div
          className="rounded-md p-12 text-center"
          style={{ background: 'var(--color-surface)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border-light)' }}
        >
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3" style={{ color: 'var(--color-primary)' }} />
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Loading your dashboard...</p>
        </div>
      ) : activeJobs.length === 0 ? (
        <div
          className="rounded-md p-12 text-center"
          style={{ background: 'var(--color-surface)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border-light)' }}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ background: 'var(--color-primary-50)' }}>
            <Briefcase className="h-8 w-8" style={{ color: 'var(--color-primary)' }} />
          </div>
          <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: 'var(--font-outfit)' }}>No active jobs</h3>
          <p className="mb-6" style={{ color: 'var(--color-text-secondary)' }}>Post your first job request to get started with Handy Pro</p>
          <Link
            href="/customer/jobs/new"
            className="inline-flex items-center gap-2 rounded-md px-6 py-3 text-sm font-semibold text-white gradient-primary hover:scale-105 transition-transform"
          >
            <Plus className="h-4 w-4" /> Post a Job Request
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold" style={{ fontFamily: 'var(--font-outfit)' }}>
              Active Jobs
            </h2>
            <div className="flex items-center gap-3">
              <Link href="/customer/jobs" className="text-sm font-medium" style={{ color: 'var(--color-primary)' }}>
                View All →
              </Link>
              <Link
                href="/customer/jobs/new"
                className="inline-flex items-center gap-1.5 rounded-md px-4 py-2 text-xs font-semibold text-white gradient-primary"
              >
                <Plus className="h-3.5 w-3.5" /> New Job
              </Link>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {activeJobs.slice(0, 4).map((job: any) => (
              <Link
                key={job.id}
                href="/customer/jobs"
                className="rounded-md p-5 space-y-2 transition-all hover:scale-[1.01] block"
                style={{ background: 'var(--color-surface)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border-light)' }}
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className="rounded-full px-2.5 py-0.5 text-xs font-medium"
                    style={{ background: 'var(--color-primary-50)', color: 'var(--color-primary)' }}
                  >
                    {job.categories?.name ?? job.category_name ?? 'Job'}
                  </span>
                  <span className="text-xs capitalize" style={{ color: 'var(--color-text-secondary)' }}>
                    {job.status} · {job.bid_count ?? 0} bids
                  </span>
                </div>
                <h3 className="font-semibold" style={{ fontFamily: 'var(--font-outfit)' }}>
                  {job.title}
                </h3>
                <p className="text-xs line-clamp-2" style={{ color: 'var(--color-text-secondary)' }}>
                  {job.description}
                </p>
                <div className="flex items-center gap-3 text-xs pt-1" style={{ color: 'var(--color-text-secondary)' }}>
                  {(job.budget_min != null || job.budget_max != null) && (
                    <span className="inline-flex items-center gap-1 font-medium" style={{ color: 'var(--color-text)' }}>
                      <DollarSign className="h-3.5 w-3.5" style={{ color: 'var(--color-accent)' }} />
                      ₦{Number(job.budget_min ?? 0).toLocaleString()}
                      {job.budget_max != null ? ` – ₦${Number(job.budget_max).toLocaleString()}` : ''}
                    </span>
                  )}
                  {job.address && (
                    <span className="inline-flex items-center gap-1 truncate">
                      <MapPin className="h-3.5 w-3.5 shrink-0" />
                      {job.address}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
