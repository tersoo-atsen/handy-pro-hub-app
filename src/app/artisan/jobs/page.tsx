import { MapPin, Clock, DollarSign } from 'lucide-react';

export default function ArtisanJobsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-outfit)' }}>Nearby Jobs</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>Browse job requests in your area</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {['All', 'Plumbing', 'Electrical', 'Carpentry', 'Painting', 'Cleaning'].map((cat) => (
          <button
            key={cat}
            className="rounded-full px-4 py-2 text-sm font-medium transition-all"
            style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-secondary)' }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Empty state */}
      <div
        className="rounded-2xl p-12 text-center"
        style={{ background: 'var(--color-surface)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border-light)' }}
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ background: 'var(--color-primary-50)' }}>
          <MapPin className="h-8 w-8" style={{ color: 'var(--color-primary)' }} />
        </div>
        <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: 'var(--font-outfit)' }}>No nearby jobs</h3>
        <p style={{ color: 'var(--color-text-secondary)' }}>Enable location to see jobs near you. We&apos;ll notify you when new jobs are posted.</p>
      </div>
    </div>
  );
}
