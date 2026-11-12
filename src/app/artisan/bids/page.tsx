import { Gavel } from 'lucide-react';

export default function ArtisanBidsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-outfit)' }}>My Bids</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>Track your submitted bids and their status</p>
      </div>

      <div className="flex gap-1 rounded-xl p-1" style={{ background: 'var(--color-bg-secondary)' }}>
        {['All', 'Pending', 'Accepted', 'Rejected', 'Expired'].map((tab) => (
          <button key={tab} className="flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all" style={{ color: 'var(--color-text-secondary)' }}>
            {tab}
          </button>
        ))}
      </div>

      <div
        className="rounded-2xl p-12 text-center"
        style={{ background: 'var(--color-surface)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border-light)' }}
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ background: 'var(--color-primary-50)' }}>
          <Gavel className="h-8 w-8" style={{ color: 'var(--color-primary)' }} />
        </div>
        <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: 'var(--font-outfit)' }}>No bids yet</h3>
        <p className="mb-6" style={{ color: 'var(--color-text-secondary)' }}>Browse nearby jobs and place your first bid</p>
        <a href="/artisan/jobs" className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white gradient-primary">
          Browse Jobs
        </a>
      </div>
    </div>
  );
}
