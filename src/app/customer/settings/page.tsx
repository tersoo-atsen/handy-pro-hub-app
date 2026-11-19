'use client';

import { useState } from 'react';
import { CheckCircle, Loader2, Lock } from 'lucide-react';

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:5000').trim();

export default function CustomerSettingsPage() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const inputStyle = {
    background: 'var(--color-bg-secondary)',
    border: '1px solid var(--color-border)',
    color: 'var(--color-text)',
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    const token =
      typeof window !== 'undefined' ? window.localStorage.getItem('access_token') : null;

    setSaving(true);
    try {
      const response = await fetch(`${API_BASE}/auth/update-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include',
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message ?? 'Failed to update password');
      }

      setSuccess(true);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.message ?? 'Failed to update password');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-outfit)' }}>
          Settings
        </h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          Manage your account security and preferences
        </p>
      </div>

      <form
        onSubmit={handlePasswordUpdate}
        className="rounded-md p-6 space-y-4 shadow-card"
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border-light)',
        }}
      >
        <div className="flex items-center gap-2">
          <Lock className="h-4 w-4" style={{ color: 'var(--color-primary)' }} />
          <h2 className="text-base font-semibold" style={{ fontFamily: 'var(--font-outfit)' }}>
            Change Password
          </h2>
        </div>

        {error && (
          <div
            className="rounded-md p-3 text-xs font-medium"
            style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444' }}
          >
            {error}
          </div>
        )}

        {success && (
          <div
            className="rounded-md p-3 text-xs font-medium flex items-center gap-2"
            style={{ background: 'rgba(16,185,129,0.1)', color: '#10B981' }}
          >
            <CheckCircle className="h-4 w-4 shrink-0" />
            Password updated successfully.
          </div>
        )}

        <div>
          <label className="block text-xs font-medium mb-1.5">Current Password</label>
          <input
            type="password"
            required
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="w-full rounded-md px-3.5 py-2.5 text-sm outline-none"
            style={inputStyle}
          />
        </div>

        <div>
          <label className="block text-xs font-medium mb-1.5">New Password</label>
          <input
            type="password"
            required
            minLength={6}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full rounded-md px-3.5 py-2.5 text-sm outline-none"
            style={inputStyle}
          />
        </div>

        <div>
          <label className="block text-xs font-medium mb-1.5">Confirm New Password</label>
          <input
            type="password"
            required
            minLength={6}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full rounded-md px-3.5 py-2.5 text-sm outline-none"
            style={inputStyle}
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 rounded-md px-5 py-2.5 text-sm font-semibold text-white gradient-primary disabled:opacity-60"
        >
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          {saving ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </div>
  );
}
