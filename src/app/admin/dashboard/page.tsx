import { Users, Briefcase, AlertTriangle, DollarSign } from 'lucide-react';

const adminStats = [
  { label: 'Total Users', value: '0', icon: Users, color: 'var(--color-primary)' },
  { label: 'Total Jobs', value: '0', icon: Briefcase, color: '#F59E0B' },
  { label: 'Open Disputes', value: '0', icon: AlertTriangle, color: '#EF4444' },
  { label: 'Revenue', value: '₦0', icon: DollarSign, color: 'var(--color-accent)' },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8 animate-fade-in">
      <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-outfit)' }}>Admin Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {adminStats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl p-5"
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
    </div>
  );
}
