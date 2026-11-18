'use client';

import { useEffect, useState } from 'react';
import { Briefcase, Plus, MapPin, DollarSign, Clock, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useUser } from '@/hooks/use-user';
import { getMyJobs } from '@/features/jobs/services/job-service';
import type { JobRequest } from '@/features/jobs/types';

export default function CustomerJobsPage() {
  const { profile, isLoading: userLoading } = useUser();
  const [jobs, setJobs] = useState<JobRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');

  useEffect(() => {
    if (!profile?.id) {
      if (!userLoading) setLoading(false);
      return;
    }
    setLoading(true);
    getMyJobs(profile.id)
      .then(({ data }) => {
        setJobs(data ?? []);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [profile?.id, userLoading]);

  const filteredJobs = jobs.filter((job) => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Active') {
      return ['open', 'bidding', 'assigned', 'in_progress'].includes(job.status);
    }
    if (activeTab === 'Completed') return job.status === 'completed';
    if (activeTab === 'Cancelled') return job.status === 'cancelled';
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-outfit)' }}>My Jobs</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>Track and manage your job requests</p>
        </div>
        <Link
          href="/customer/jobs/new"
          className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white gradient-primary hover:scale-105 transition-transform"
          style={{ boxShadow: 'var(--shadow-md)' }}
        >
          <Plus className="h-4 w-4" />
          New Job
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl p-1" style={{ background: 'var(--color-bg-secondary)' }}>
        {['All', 'Active', 'Completed', 'Cancelled'].map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className="flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all"
            style={{
              background: activeTab === tab ? 'var(--color-surface)' : 'transparent',
              color: activeTab === tab ? 'var(--color-text)' : 'var(--color-text-secondary)',
              boxShadow: activeTab === tab ? 'var(--shadow-sm)' : 'none',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Results / Empty state */}
      {loading ? (
        <div
          className="rounded-2xl p-12 text-center"
          style={{ background: 'var(--color-surface)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border-light)' }}
        >
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3" style={{ color: 'var(--color-primary)' }} />
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Loading your jobs...</p>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div
          className="rounded-2xl p-12 text-center"
          style={{ background: 'var(--color-surface)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border-light)' }}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ background: 'var(--color-primary-50)' }}>
            <Briefcase className="h-8 w-8" style={{ color: 'var(--color-primary)' }} />
          </div>
          <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: 'var(--font-outfit)' }}>No jobs yet</h3>
          <p className="mb-6" style={{ color: 'var(--color-text-secondary)' }}>Create your first job request to find skilled artisans</p>
          <Link
            href="/customer/jobs/new"
            className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white gradient-primary"
          >
            <Plus className="h-4 w-4" /> Post a Job
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map((job: any) => (
            <div
              key={job.id}
              className="rounded-2xl p-6 space-y-3"
              style={{ background: 'var(--color-surface)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border-light)' }}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {(job.categories?.name || job.category_name) && (
                      <span
                        className="rounded-full px-2.5 py-0.5 text-xs font-medium"
                        style={{ background: 'var(--color-primary-50)', color: 'var(--color-primary)' }}
                      >
                        {job.categories?.name ?? job.category_name}
                      </span>
                    )}
                    <span
                      className="rounded-full px-2.5 py-0.5 text-xs font-medium capitalize"
                      style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text-secondary)' }}
                    >
                      {job.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold" style={{ fontFamily: 'var(--font-outfit)' }}>
                    {job.title}
                  </h3>
                </div>
              </div>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
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
                  </span>
                )}
                {job.created_at && (
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {new Date(job.created_at).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
