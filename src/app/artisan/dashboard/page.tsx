'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MapPin, DollarSign, Star, Briefcase, Clock, Loader2 } from 'lucide-react';
import { useUser } from '@/hooks/use-user';
import { useGeolocation } from '@/hooks/use-geolocation';
import { findNearbyJobs } from '@/features/jobs/services/job-service';
import { getMyBids } from '@/features/bidding/services/bid-service';
import { getMyBookings } from '@/features/bookings/services/booking-service';
import { getArtisanProfile } from '@/features/artisans/services/artisan-service';
import type { JobRequest } from '@/features/jobs/types';

export default function ArtisanDashboard() {
  const { profile, isLoading: userLoading } = useUser();
  const { latitude, longitude } = useGeolocation();

  const [nearbyJobs, setNearbyJobs] = useState<JobRequest[]>([]);
  const [bids, setBids] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [ratingAvg, setRatingAvg] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile?.id) {
      if (!userLoading) setLoading(false);
      return;
    }

    setLoading(true);
    Promise.all([
      findNearbyJobs(latitude, longitude, 15),
      getMyBids(profile.id),
      getMyBookings(profile.id),
      getArtisanProfile(profile.id),
    ])
      .then(([jobsRes, bidsRes, bookingsRes, artisanRes]) => {
        setNearbyJobs(jobsRes.data ?? []);
        setBids(bidsRes.data ?? []);
        setBookings(bookingsRes.data ?? []);
        if (artisanRes.data?.rating_avg != null) {
          setRatingAvg(Number(artisanRes.data.rating_avg));
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [profile?.id, userLoading, latitude, longitude]);

  const activeBidsCount = bids.filter((b) => b.status === 'pending').length;
  const totalEarnings = bookings
    .filter((b) => b.status === 'completed')
    .reduce((sum, b) => sum + Number(b.agreed_amount ?? 0), 0);

  const artisanStats = [
    { label: 'Jobs Nearby', value: String(nearbyJobs.length), icon: MapPin, color: 'var(--color-primary)', href: '/artisan/jobs' },
    { label: 'Active Bids', value: String(activeBidsCount), icon: Briefcase, color: '#F59E0B', href: '/artisan/bids' },
    { label: 'Rating', value: ratingAvg.toFixed(1), icon: Star, color: 'var(--color-accent)', href: '/artisan/profile' },
    { label: 'Earnings', value: `₦${totalEarnings.toLocaleString()}`, icon: DollarSign, color: '#8B5CF6', href: '/artisan/bookings' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-outfit)' }}>
          Artisan Dashboard
        </h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          Welcome back{profile?.full_name ? `, ${profile.full_name}` : ''}! Manage your jobs, bids, and earnings.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {artisanStats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="rounded-md p-5 transition-all hover:scale-[1.02] block"
            style={{ background: 'var(--color-surface)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border-light)' }}
          >
            <div className="h-10 w-10 rounded-md flex items-center justify-center mb-3" style={{ background: `${stat.color}15` }}>
              <stat.icon className="h-5 w-5" style={{ color: stat.color }} />
            </div>
            <p className="text-2xl font-bold" style={{ fontFamily: 'var(--font-outfit)' }}>{stat.value}</p>
            <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>{stat.label}</p>
          </Link>
        ))}
      </div>

      {loading ? (
        <div
          className="rounded-md p-12 text-center"
          style={{ background: 'var(--color-surface)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border-light)' }}
        >
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3" style={{ color: 'var(--color-primary)' }} />
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Loading dashboard...</p>
        </div>
      ) : nearbyJobs.length === 0 ? (
        <div
          className="rounded-md p-12 text-center"
          style={{ background: 'var(--color-surface)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border-light)' }}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ background: 'var(--color-primary-50)' }}>
            <MapPin className="h-8 w-8" style={{ color: 'var(--color-primary)' }} />
          </div>
          <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: 'var(--font-outfit)' }}>No nearby jobs</h3>
          <p className="mb-6" style={{ color: 'var(--color-text-secondary)' }}>
            Enable location services to discover job requests near you.
          </p>
          <Link
            href="/artisan/jobs"
            className="inline-flex items-center gap-2 rounded-md px-6 py-3 text-sm font-semibold text-white gradient-primary hover:scale-105 transition-transform"
          >
            Browse Jobs
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold" style={{ fontFamily: 'var(--font-outfit)' }}>
              Recent Nearby Jobs
            </h2>
            <Link href="/artisan/jobs" className="text-sm font-medium" style={{ color: 'var(--color-primary)' }}>
              View All ({nearbyJobs.length}) →
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {nearbyJobs.slice(0, 4).map((job) => (
              <Link
                key={job.id}
                href="/artisan/jobs"
                className="rounded-md p-5 space-y-2 transition-all hover:scale-[1.01] block"
                style={{ background: 'var(--color-surface)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border-light)' }}
              >
                <div className="flex items-center justify-between gap-2">
                  {job.category_name && (
                    <span
                      className="rounded-full px-2.5 py-0.5 text-xs font-medium"
                      style={{ background: 'var(--color-primary-50)', color: 'var(--color-primary)' }}
                    >
                      {job.category_name}
                    </span>
                  )}
                  <span className="text-xs capitalize" style={{ color: 'var(--color-text-secondary)' }}>
                    {job.urgency} · {job.bid_count ?? 0} bids
                  </span>
                </div>
                <h3 className="font-semibold" style={{ fontFamily: 'var(--font-outfit)' }}>
                  {job.title}
                </h3>
                <p className="text-xs line-clamp-2" style={{ color: 'var(--color-text-secondary)' }}>
                  {job.description}
                </p>
                <div className="flex flex-wrap items-center gap-3 text-xs pt-1" style={{ color: 'var(--color-text-secondary)' }}>
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
                  {job.created_at && (
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {new Date(job.created_at).toLocaleDateString()}
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
