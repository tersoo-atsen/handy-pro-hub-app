import { AlertTriangle } from 'lucide-react';

export default function AdminDisputesPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-outfit)' }}>Disputes</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>Review and resolve reported issues</p>
      </div>

      <div className="flex gap-1 rounded-xl p-1" style={{ background: 'var(--color-bg-secondary)' }}>
        {['Open', 'Under Review', 'Resolved'].map((tab) => (
          <button key={tab} className="flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all" style={{ color: 'var(--color-text-secondary)' }}>
            {tab}
          </button>
        ))}
      </div>

      <div
        className="rounded-2xl p-12 text-center"
        style={{ background: 'var(--color-surface)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border-light)' }}
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ background: 'rgba(16,185,129,0.1)' }}>
          <AlertTriangle className="h-8 w-8" style={{ color: 'var(--color-accent)' }} />
        </div>
        <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: 'var(--font-outfit)' }}>No open disputes</h3>
        <p style={{ color: 'var(--color-text-secondary)' }}>All clear! There are no unresolved disputes at this time.</p>
      </div>
    </div>
  );
}
