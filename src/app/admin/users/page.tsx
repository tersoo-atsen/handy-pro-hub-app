'use client';

import { useEffect, useState } from 'react';
import { Users, Search, Shield, UserCheck } from 'lucide-react';
import { getProfiles } from '@/features/profiles/services/profile-service';
import type { UserProfile } from '@/hooks/use-user';

const filterRoleMap: Record<string, string | undefined> = {
  All: undefined,
  Customers: 'customer',
  Artisans: 'artisan',
  Admins: 'admin',
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    getProfiles({
      role: filterRoleMap[activeFilter],
      search: search.trim() || undefined,
    }).then(({ data }) => {
      if (Array.isArray(data)) {
        setUsers(data);
      }
    });
  }, [activeFilter, search]);

  const verifiedArtisansCount = users.filter((u) => u.role === 'artisan' && u.is_verified).length;
  const activeCount = users.filter((u) => u.is_active).length;

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
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users by name or email..."
            className="w-full rounded-md pl-11 pr-4 py-3 text-sm outline-none"
            style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
          />
        </div>
        <div className="flex gap-2">
          {['All', 'Customers', 'Artisans', 'Admins'].map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              className="rounded-md px-4 py-2 text-sm font-medium transition-all"
              style={{
                background: activeFilter === filter ? 'var(--color-primary-50)' : 'var(--color-surface)',
                border: `1px solid ${activeFilter === filter ? 'var(--color-primary)' : 'var(--color-border)'}`,
                color: activeFilter === filter ? 'var(--color-primary)' : 'var(--color-text-secondary)',
              }}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Users', value: String(users.length), icon: Users, color: 'var(--color-primary)' },
          { label: 'Verified Artisans', value: String(verifiedArtisansCount), icon: Shield, color: 'var(--color-accent)' },
          { label: 'Active Accounts', value: String(activeCount), icon: UserCheck, color: '#F59E0B' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-md p-4" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-light)' }}>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-md flex items-center justify-center" style={{ background: `${stat.color}15` }}>
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

      {/* Table */}
      <div
        className="rounded-md overflow-hidden"
        style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-light)' }}
      >
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
              {['Name', 'Email', 'Role', 'Status', 'City/State'].map((h) => (
                <th key={h} className="text-left px-6 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--color-text-tertiary)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  No users found
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id} style={{ borderBottom: '1px solid var(--color-border-light)' }}>
                  <td className="px-6 py-4 text-sm font-medium">{u.full_name}</td>
                  <td className="px-6 py-4 text-sm" style={{ color: 'var(--color-text-secondary)' }}>{u.email}</td>
                  <td className="px-6 py-4 text-sm capitalize">{u.role}</td>
                  <td className="px-6 py-4 text-sm">{u.is_active ? 'Active' : 'Inactive'}</td>
                  <td className="px-6 py-4 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    {[u.city, u.state].filter(Boolean).join(', ') || '—'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
