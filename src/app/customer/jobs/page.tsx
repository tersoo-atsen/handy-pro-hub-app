import { Briefcase, Plus } from 'lucide-react';
import Link from 'next/link';

export default function CustomerJobsPage() {
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
            className="flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {tab}
          </button>
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
        <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: 'var(--font-outfit)' }}>No jobs yet</h3>
        <p className="mb-6" style={{ color: 'var(--color-text-secondary)' }}>Create your first job request to find skilled artisans</p>
        <Link
          href="/customer/jobs/new"
          className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white gradient-primary"
        >
          <Plus className="h-4 w-4" /> Post a Job
        </Link>
      </div>
    </div>
  );
}
