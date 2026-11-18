'use client';

import { useEffect, useState } from 'react';
import { MapPin, Clock, DollarSign, Briefcase, Gavel, Loader2 } from 'lucide-react';
import { useUser } from '@/hooks/use-user';
import { useGeolocation } from '@/hooks/use-geolocation';
import { getAllCategories } from '@/features/search/services/search-service';
import { findNearbyJobs } from '@/features/jobs/services/job-service';
import { createBid } from '@/features/bidding/services/bid-service';
import type { CategoryItem } from '@/features/search/types';
import type { JobRequest } from '@/features/jobs/types';

const fallbackCategories: Array<{ name: string; slug: string }> = [
  { name: 'Plumbing', slug: 'plumbing' },
  { name: 'Electrical', slug: 'electrical' },
  { name: 'Carpentry', slug: 'carpentry' },
  { name: 'Painting', slug: 'painting' },
  { name: 'Cleaning', slug: 'cleaning' },
];

const urgencyStyles: Record<string, { bg: string; color: string }> = {
  low: { bg: 'rgba(107,114,128,0.1)', color: '#6B7280' },
  normal: { bg: 'rgba(59,130,246,0.1)', color: '#3B82F6' },
  urgent: { bg: 'rgba(245,158,11,0.1)', color: '#F59E0B' },
  emergency: { bg: 'rgba(239,68,68,0.1)', color: '#EF4444' },
};

export default function ArtisanJobsPage() {
  const { profile } = useUser();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [categories, setCategories] = useState<Array<{ name: string; slug: string }>>(fallbackCategories);
  const [jobs, setJobs] = useState<JobRequest[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);

  const [biddingJobId, setBiddingJobId] = useState<string | null>(null);
  const [bidAmount, setBidAmount] = useState('');
  const [bidHours, setBidHours] = useState('');
  const [bidMessage, setBidMessage] = useState('');
  const [submittingBid, setSubmittingBid] = useState(false);
  const [bidFeedback, setBidFeedback] = useState<{ jobId: string; type: 'success' | 'error'; text: string } | null>(null);

  const { latitude, longitude, isLoading: geoLoading, refresh: refreshLocation } = useGeolocation();

  useEffect(() => {
    getAllCategories().then(({ data }) => {
      if (Array.isArray(data) && data.length > 0) {
        setCategories(data.map((c: CategoryItem) => ({ name: c.name, slug: c.slug })));
      }
    });
  }, []);

  useEffect(() => {
    setLoadingJobs(true);
    findNearbyJobs(
      latitude,
      longitude,
      15,
      selectedCategory === 'all' ? undefined : selectedCategory
    )
      .then(({ data }) => {
        setJobs(data ?? []);
      })
      .catch(() => {
        setJobs([]);
      })
      .finally(() => {
        setLoadingJobs(false);
      });
  }, [latitude, longitude, selectedCategory]);

  const handleOpenBidForm = (jobId: string) => {
    setBiddingJobId(biddingJobId === jobId ? null : jobId);
    setBidAmount('');
    setBidHours('');
    setBidMessage('');
    setBidFeedback(null);
  };

  const handleSubmitBid = async (e: React.FormEvent, jobId: string) => {
    e.preventDefault();
    if (!profile?.id) return;
    setSubmittingBid(true);
    setBidFeedback(null);

    const { error } = await createBid({
      job_id: jobId,
      artisan_id: profile.id,
      amount: Number(bidAmount),
      message: bidMessage,
      estimated_hours: bidHours ? Number(bidHours) : undefined,
    });

    setSubmittingBid(false);
    if (error) {
      setBidFeedback({ jobId, type: 'error', text: error.message });
    } else {
      setBidFeedback({ jobId, type: 'success', text: 'Bid submitted successfully!' });
      setJobs((prev) =>
        prev.map((j) =>
          j.id === jobId ? { ...j, bid_count: (j.bid_count ?? 0) + 1 } : j
        )
      );
      setBiddingJobId(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-outfit)' }}>Nearby Jobs</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>Browse job requests in your area</p>
        </div>
        {(latitude === null || longitude === null) && (
          <button
            type="button"
            onClick={refreshLocation}
            disabled={geoLoading}
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-white gradient-primary disabled:opacity-60"
          >
            {geoLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
            Enable Location
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setSelectedCategory('all')}
          className="rounded-full px-4 py-2 text-sm font-medium transition-all"
          style={{
            background: selectedCategory === 'all' ? 'var(--color-primary-50)' : 'var(--color-surface)',
            border: `1px solid ${selectedCategory === 'all' ? 'var(--color-primary)' : 'var(--color-border)'}`,
            color: selectedCategory === 'all' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
          }}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.slug}
            type="button"
            onClick={() => setSelectedCategory(cat.slug)}
            className="rounded-full px-4 py-2 text-sm font-medium transition-all"
            style={{
              background: selectedCategory === cat.slug ? 'var(--color-primary-50)' : 'var(--color-surface)',
              border: `1px solid ${selectedCategory === cat.slug ? 'var(--color-primary)' : 'var(--color-border)'}`,
              color: selectedCategory === cat.slug ? 'var(--color-primary)' : 'var(--color-text-secondary)',
            }}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Results / Empty state */}
      {loadingJobs ? (
        <div
          className="rounded-2xl p-12 text-center"
          style={{ background: 'var(--color-surface)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border-light)' }}
        >
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3" style={{ color: 'var(--color-primary)' }} />
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Loading open jobs...</p>
        </div>
      ) : jobs.length === 0 ? (
        <div
          className="rounded-2xl p-12 text-center"
          style={{ background: 'var(--color-surface)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border-light)' }}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ background: 'var(--color-primary-50)' }}>
            <MapPin className="h-8 w-8" style={{ color: 'var(--color-primary)' }} />
          </div>
          <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: 'var(--font-outfit)' }}>No nearby jobs</h3>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            {latitude === null || longitude === null
              ? "Enable location to see jobs near you. We'll notify you when new jobs are posted."
              : 'No open jobs match the selected category right now.'}
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {jobs.map((job) => {
            const urgencyStyle = urgencyStyles[job.urgency] ?? urgencyStyles.normal;
            const isOpenForm = biddingJobId === job.id;
            return (
              <div
                key={job.id}
                className="rounded-2xl p-6 space-y-4 transition-all"
                style={{ background: 'var(--color-surface)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border-light)' }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {job.category_name && (
                        <span
                          className="rounded-full px-2.5 py-0.5 text-xs font-medium"
                          style={{ background: 'var(--color-primary-50)', color: 'var(--color-primary)' }}
                        >
                          {job.category_name}
                        </span>
                      )}
                      <span
                        className="rounded-full px-2.5 py-0.5 text-xs font-medium capitalize"
                        style={{ background: urgencyStyle.bg, color: urgencyStyle.color }}
                      >
                        {job.urgency}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold" style={{ fontFamily: 'var(--font-outfit)' }}>
                      {job.title}
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenBidForm(job.id)}
                    className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold text-white gradient-primary"
                  >
                    <Gavel className="h-3.5 w-3.5" />
                    {isOpenForm ? 'Cancel' : 'Place Bid'}
                  </button>
                </div>

                <p className="text-sm line-clamp-2" style={{ color: 'var(--color-text-secondary)' }}>
                  {job.description}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                  {(job.budget_min != null || job.budget_max != null) && (
                    <span className="inline-flex items-center gap-1 font-medium" style={{ color: 'var(--color-text)' }}>
                      <DollarSign className="h-3.5 w-3.5" style={{ color: 'var(--color-accent)' }} />
                      ₦{Number(job.budget_min ?? 0).toLocaleString()}
                      {job.budget_max != null ? ` – ₦${Number(job.budget_max).toLocaleString()}` : ''}
                    </span>
                  )}
                  {job.address && (
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {job.address}
                      {job.distance_km != null ? ` (${job.distance_km} km)` : ''}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1">
                    <Briefcase className="h-3.5 w-3.5" />
                    {job.bid_count ?? 0} bids
                  </span>
                  {job.created_at && (
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {new Date(job.created_at).toLocaleDateString()}
                    </span>
                  )}
                </div>

                {bidFeedback && bidFeedback.jobId === job.id && (
                  <div
                    className="rounded-lg px-3 py-2 text-xs font-medium"
                    style={{
                      background: bidFeedback.type === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                      color: bidFeedback.type === 'success' ? '#10B981' : '#EF4444',
                    }}
                  >
                    {bidFeedback.text}
                  </div>
                )}

                {isOpenForm && (
                  <form
                    onSubmit={(e) => handleSubmitBid(e, job.id)}
                    className="space-y-3 pt-3"
                    style={{ borderTop: '1px solid var(--color-border-light)' }}
                  >
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium mb-1">Bid Amount (₦)</label>
                        <input
                          type="number"
                          required
                          min={0}
                          value={bidAmount}
                          onChange={(e) => setBidAmount(e.target.value)}
                          placeholder="15000"
                          className="w-full rounded-xl px-3 py-2 text-sm outline-none"
                          style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1">Est. Hours</label>
                        <input
                          type="number"
                          min={0}
                          step="0.5"
                          value={bidHours}
                          onChange={(e) => setBidHours(e.target.value)}
                          placeholder="2"
                          className="w-full rounded-xl px-3 py-2 text-sm outline-none"
                          style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Proposal Message</label>
                      <textarea
                        rows={2}
                        value={bidMessage}
                        onChange={(e) => setBidMessage(e.target.value)}
                        placeholder="Describe your approach and availability..."
                        className="w-full rounded-xl px-3 py-2 text-sm outline-none resize-none"
                        style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={submittingBid}
                      className="w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold text-white gradient-primary disabled:opacity-60"
                    >
                      {submittingBid ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Submit Bid'}
                    </button>
                  </form>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
