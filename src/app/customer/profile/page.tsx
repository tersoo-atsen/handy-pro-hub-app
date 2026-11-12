'use client';

import { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  LogOut,
  Loader2,
} from 'lucide-react';
import { useUser } from '@/hooks/use-user';
import { useSupabase } from '@/providers/supabase-provider';
import { signOut } from '@/features/auth/services/auth-service';

export default function CustomerProfilePage() {
  const { profile, isLoading } = useUser();
  const { supabase } = useSupabase();

  const [saving, setSaving] = useState(false);
  const [prevProfileId, setPrevProfileId] = useState(profile?.id);
  const [formData, setFormData] = useState({
    fullName: profile?.full_name || '',
    phone: profile?.phone || '',
    address: profile?.address || '',
    city: profile?.city || '',
    state: profile?.state || '',
  });

  // Prepopulate form once profile data arrives from Supabase
  if (profile && profile.id !== prevProfileId) {
    setPrevProfileId(profile.id);
    setFormData({
      fullName: profile.full_name || '',
      phone: profile.phone || '',
      address: profile.address || '',
      city: profile.city || '',
      state: profile.state || '',
    });
  }

  if (isLoading) {
    return <div>Loading profile...</div>; // or a skeleton loader
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: formData.fullName,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
      })
      .eq('id', profile.id);

    setSaving(false);
    if (!error) {
      // show toast / success message
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-outfit)' }}>Profile</h1>

      {/* Upgrade to Artisan – only show if not already an artisan */}
      {profile?.role !== 'artisan' && (
        <button
          type="button"
          onClick={async () => {
            setSaving(true);
            const { error } = await supabase
              .from('profiles')
              .update({ role: 'artisan' })
              .eq('id', profile.id);
            if (!error) {
              await supabase.from('artisan_profiles').upsert({ user_id: profile.id });
              window.location.href = '/artisan/dashboard';
            }
            setSaving(false);
          }}
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white gradient-primary hover:scale-[1.02] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ boxShadow: 'var(--shadow-md)' }}
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Upgrading…
            </>
          ) : (
            'Upgrade to Pro Artisan'
          )}
        </button>
      )}

      {/* Avatar section */}
      <div
        className="rounded-2xl p-6 flex items-center gap-6"
        style={{ background: 'var(--color-surface)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border-light)' }}
      >
        <div className="relative">
          <div className="h-20 w-20 rounded-full flex items-center justify-center" style={{ background: 'var(--color-primary-50)' }}>
            <User className="h-10 w-10" style={{ color: 'var(--color-primary)' }} />
          </div>
          <button
            className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full flex items-center justify-center text-white gradient-primary"
            style={{ boxShadow: 'var(--shadow-md)' }}
          >
            <Camera className="h-4 w-4" />
          </button>

        </div>
        <div>
          <h2 className="text-lg font-semibold" style={{ fontFamily: 'var(--font-outfit)' }}>
            {profile?.full_name || 'Your Name'}
          </h2>
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Customer Account</p>
        </div>
      </div>

      {/* Profile form */}
      <div
        className="rounded-2xl p-6 space-y-5"
        style={{ background: 'var(--color-surface)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border-light)' }}
      >
        <h3 className="font-semibold" style={{ fontFamily: 'var(--font-outfit)' }}>Personal Information</h3>

        <div>
          <label className="block text-sm font-medium mb-2">Full Name</label>
          <div className="relative">
            <User
              className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5"
              style={{ color: 'var(--color-text-tertiary)' }}
            />
            <input
              type="text"
              placeholder="Your full name"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full rounded-xl pl-11 pr-4 py-3 text-sm outline-none"
              style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <div className="relative">
            <Mail
              className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5"
              style={{ color: 'var(--color-text-tertiary)' }}
            />
            <input
              type="email"
              placeholder="you@example.com"
              disabled
              value={profile?.email || ''}
              className="w-full rounded-xl pl-11 pr-4 py-3 text-sm outline-none opacity-60"
              style={{
                background: 'var(--color-bg-secondary)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text)'
              }}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Phone</label>
          <div className="relative">
            <Phone
              className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5"
              style={{ color: 'var(--color-text-tertiary)' }}
            />
            <input
              type="tel"
              placeholder="+234 800 000 0000"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full rounded-xl pl-11 pr-4 py-3 text-sm outline-none"
              style={{
                background: 'var(--color-bg-secondary)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text)'
              }}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Address</label>
          <div className="relative">
            <MapPin
              className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5"
              style={{ color: 'var(--color-text-tertiary)' }}
            />
            <input
              type="text"
              placeholder="Your address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full rounded-xl pl-11 pr-4 py-3 text-sm outline-none"
              style={{
                background: 'var(--color-bg-secondary)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text)'
              }}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">City</label>
          <div className="relative">
            <MapPin
              className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5"
              style={{ color: 'var(--color-text-tertiary)' }}
            />
            <input
              type="text"
              placeholder="Your city"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="w-full rounded-xl pl-11 pr-4 py-3 text-sm outline-none"
              style={{
                background: 'var(--color-bg-secondary)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text)'
              }}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">State</label>
          <div className="relative">
            <MapPin
              className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5"
              style={{ color: 'var(--color-text-tertiary)' }}
            />
            <input
              type="text"
              placeholder="Your state"
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              className="w-full rounded-xl pl-11 pr-4 py-3 text-sm outline-none"
              style={{
                background: 'var(--color-bg-secondary)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text)'
              }}
            />
          </div>
        </div>

        <button
          type="button"
          disabled={saving}
          onClick={handleSave}
          className="w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white gradient-primary hover:scale-[1.02] transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
          style={{ boxShadow: 'var(--shadow-md)' }}
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </button>
      </div>

      {/* Sign out */}
      <button
        onClick={async () => {
          await signOut();
          window.location.href = '/login';
        }}
        className="w-full flex items-center justify-center gap-2 rounded-2xl py-3 text-sm font-medium transition-all"
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          color: '#EF4444'
        }}
      >
        <LogOut className="h-4 w-4" />
        Sign Out
      </button>
    </div>
  );
}
