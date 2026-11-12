import { Briefcase, Search, Clock, CheckCircle } from 'lucide-react';

export default function AdminJobsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-outfit)' }}>Jobs</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>Monitor all job requests across the platform</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5" style={{ color: 'var(--color-text-tertiary)' }} />
          <input
            type="text"
            placeholder="Search jobs..."
            className="w-full rounded-xl pl-11 pr-4 py-3 text-sm outline-none"
            style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
          />
        </div>
        <div className="flex gap-2">
          {['All', 'Open', 'In Progress', 'Completed', 'Disputed'].map((f) => (
            <button key={f} className="rounded-lg px-4 py-2 text-sm font-medium whitespace-nowrap transition-all" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-secondary)' }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Jobs', value: '0', icon: Briefcase, color: 'var(--color-primary)' },
          { label: 'Active Now', value: '0', icon: Clock, color: '#F59E0B' },
          { label: 'Completed', value: '0', icon: CheckCircle, color: 'var(--color-accent)' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl p-4" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-light)' }}>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg flex items-center justify-center" style={{ background: `${stat.color}15` }}>
                <stat.icon className="h-5 w-5" style={{ color: stat.color }} />
              </div>
              <div>
                <p className="text-xl font-bold" style={{ fontFamily: 'var(--font-outfit)' }}>{stat.value}</p>
                <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-light)' }}
      >
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
              {['Title', 'Customer', 'Category', 'Status', 'Budget', 'Created'].map((h) => (
                <th key={h} className="text-left px-6 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--color-text-tertiary)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={6} className="px-6 py-12 text-center text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                No jobs found
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
