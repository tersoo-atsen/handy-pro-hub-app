import { Users, Search, Shield, UserCheck } from 'lucide-react';

export default function AdminUsersPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-outfit)' }}>Users</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>Manage customers and artisans</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5" style={{ color: 'var(--color-text-tertiary)' }} />
          <input
            type="text"
            placeholder="Search users by name or email..."
            className="w-full rounded-xl pl-11 pr-4 py-3 text-sm outline-none"
            style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
          />
        </div>
        <div className="flex gap-2">
          {['All', 'Customers', 'Artisans', 'Admins'].map((filter) => (
            <button key={filter} className="rounded-lg px-4 py-2 text-sm font-medium transition-all" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-secondary)' }}>
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Users', value: '0', icon: Users, color: 'var(--color-primary)' },
          { label: 'Verified Artisans', value: '0', icon: Shield, color: 'var(--color-accent)' },
          { label: 'Active Today', value: '0', icon: UserCheck, color: '#F59E0B' },
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

      {/* Table placeholder */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-light)' }}
      >
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
              {['Name', 'Email', 'Role', 'Status', 'Joined'].map((h) => (
                <th key={h} className="text-left px-6 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--color-text-tertiary)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={5} className="px-6 py-12 text-center text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                No users found
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
