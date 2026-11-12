import { Calendar } from 'lucide-react';

export default function ArtisanBookingsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-outfit)' }}>Bookings</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>Manage your upcoming and completed jobs</p>
      </div>

      <div className="flex gap-1 rounded-xl p-1" style={{ background: 'var(--color-bg-secondary)' }}>
        {['Upcoming', 'In Progress', 'Completed', 'Cancelled'].map((tab) => (
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
          <Calendar className="h-8 w-8" style={{ color: 'var(--color-primary)' }} />
        </div>
        <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: 'var(--font-outfit)' }}>No bookings yet</h3>
        <p style={{ color: 'var(--color-text-secondary)' }}>When a customer accepts your bid, the booking will appear here</p>
      </div>
    </div>
  );
}
