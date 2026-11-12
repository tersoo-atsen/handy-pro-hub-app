import { MapPin, DollarSign, Star, Briefcase } from 'lucide-react';

const artisanStats = [
  { label: 'Jobs Nearby', value: '0', icon: MapPin, color: 'var(--color-primary)' },
  { label: 'Active Bids', value: '0', icon: Briefcase, color: '#F59E0B' },
  { label: 'Rating', value: '0.0', icon: Star, color: 'var(--color-accent)' },
  { label: 'Earnings', value: '₦0', icon: DollarSign, color: '#8B5CF6' },
];

export default function ArtisanDashboard() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-outfit)' }}>Artisan Dashboard</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>Manage your jobs, bids, and earnings.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {artisanStats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl p-5 transition-all hover:scale-[1.02]"
            style={{ background: 'var(--color-surface)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border-light)' }}
          >
            <div className="h-10 w-10 rounded-xl flex items-center justify-center mb-3" style={{ background: `${stat.color}15` }}>
              <stat.icon className="h-5 w-5" style={{ color: stat.color }} />
            </div>
            <p className="text-2xl font-bold" style={{ fontFamily: 'var(--font-outfit)' }}>{stat.value}</p>
            <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>{stat.label}</p>
          </div>
        ))}
      </div>

      <div
        className="rounded-2xl p-12 text-center"
        style={{ background: 'var(--color-surface)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border-light)' }}
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ background: 'var(--color-primary-50)' }}>
          <MapPin className="h-8 w-8" style={{ color: 'var(--color-primary)' }} />
        </div>
        <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: 'var(--font-outfit)' }}>No nearby jobs</h3>
        <p className="mb-6" style={{ color: 'var(--color-text-secondary)' }}>Enable location services to discover job requests near you.</p>
        <a
          href="/artisan/jobs"
          className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white gradient-primary hover:scale-105 transition-transform"
        >
          Browse Jobs
        </a>
      </div>
    </div>
  );
}
