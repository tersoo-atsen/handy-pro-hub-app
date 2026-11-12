'use client';

import { User, Mail, Phone, MapPin, Camera, Wrench, Star, LogOut, Loader2 } from 'lucide-react';
import { useUser } from '@/hooks/use-user';
import { useSupabase } from '@/providers/supabase-provider';
import { signOut } from '@/features/auth/services/auth-service';
import { useState, useEffect } from 'react';

export default function ArtisanProfilePage() {
  const inputStyle = {
    background: 'var(--color-bg-secondary)',
    border: '1px solid var(--color-border)',
    color: 'var(--color-text)',
  };

  const { profile, isLoading } = useUser();
  const { supabase } = useSupabase();

  const [saving, setSaving] = useState(false);
  const [prevProfileId, setPrevProfileId] = useState<string | undefined>(profile?.id);
  const [formData, setFormData] = useState({
    fullName: profile?.full_name || '',
    phone: profile?.phone || '',
    address: profile?.address || '',
    city: profile?.city || '',
    state: profile?.state || '',
  });

  // Pre‑populate form when profile loads
  useEffect(() => {
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
  }, [profile, prevProfileId]);

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
      // TODO: show toast / success feedback
    }
  };

  if (isLoading) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="max-w-2xl space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-outfit)' }}>Artisan Profile</h1>

      {/* Avatar */}
      <div className="rounded-2xl p-6 flex items-center gap-6" style={{ background: 'var(--color-surface)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border-light)' }}>
        <div className="relative">
          <div className="h-20 w-20 rounded-full flex items-center justify-center" style={{ background: 'var(--color-primary-50)' }}>
            <Wrench className="h-10 w-10" style={{ color: 'var(--color-primary)' }} />
          </div>
          <button className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full flex items-center justify-center text-white gradient-primary" style={{ boxShadow: 'var(--shadow-md)' }}>
            <Camera className="h-4 w-4" />
          </button>
        </div>
        <div>
          <h2 className="text-lg font-semibold" style={{ fontFamily: 'var(--font-outfit)' }}>{profile?.full_name || 'Your Name'}</h2>
          <div className="flex items-center gap-2 mt-1">
            <Star className="h-4 w-4" style={{ color: '#F59E0B' }} />
            <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>0.0 rating · 0 reviews</span>
          </div>
        </div>
      </div>

      {/* Personal info */}
      <div className="rounded-2xl p-6 space-y-5" style={{ background: 'var(--color-surface)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border-light)' }}>
        <h3 className="font-semibold" style={{ fontFamily: 'var(--font-outfit)' }}>Personal Information</h3>
        <div>
          <label className="block text-sm font-medium mb-2">Full Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5" style={{ color: 'var(--color-text-tertiary)' }} />
            <input
              type="text"
              placeholder="Your full name"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full rounded-xl pl-11 pr-4 py-3 text-sm outline-none"
              style={inputStyle}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5" style={{ color: 'var(--color-text-tertiary)' }} />
            <input
              type="email"
              disabled
              placeholder="you@example.com"
              value={profile?.email || ''}
              className="w-full rounded-xl pl-11 pr-4 py-3 text-sm outline-none opacity-60"
              style={inputStyle}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Phone</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5" style={{ color: 'var(--color-text-tertiary)' }} />
            <input
              type="tel"
              placeholder="+234 800 000 0000"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full rounded-xl pl-11 pr-4 py-3 text-sm outline-none"
              style={inputStyle}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Address</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5" style={{ color: 'var(--color-text-tertiary)' }} />
            <input
              type="text"
              placeholder="Your address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full rounded-xl pl-11 pr-4 py-3 text-sm outline-none"
              style={inputStyle}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">City</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5" style={{ color: 'var(--color-text-tertiary)' }} />
            <input
              type="text"
              placeholder="Your city"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="w-full rounded-xl pl-11 pr-4 py-3 text-sm outline-none"
              style={inputStyle}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">State</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5" style={{ color: 'var(--color-text-tertiary)' }} />
            <input
              type="text"
              placeholder="Your state"
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              className="w-full rounded-xl pl-11 pr-4 py-3 text-sm outline-none"
              style={inputStyle}
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
              <Loader2 className="h-4 w-4 animate-spin" /> Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </button>
      </div>

      {/* Professional info */}
      <div className="rounded-2xl p-6 space-y-5" style={{ background: 'var(--color-surface)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border-light)' }}>
        <h3 className="font-semibold" style={{ fontFamily: 'var(--font-outfit)' }}>Professional Details</h3>
        <div>
          <label className="block text-sm font-medium mb-2">Bio</label>
          <textarea rows={3} placeholder="Tell customers about your experience..." className="w-full rounded-xl px-4 py-3 text-sm outline-none resize-none" style={inputStyle} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Hourly Rate (₦)</label>
            <input type="number" placeholder="5,000" className="w-full rounded-xl px-4 py-3 text-sm outline-none" style={inputStyle} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Years of Experience</label>
            <input type="number" placeholder="5" className="w-full rounded-xl px-4 py-3 text-sm outline-none" style={inputStyle} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Service Radius (km)</label>
          <input type="number" placeholder="10" className="w-full rounded-xl px-4 py-3 text-sm outline-none" style={inputStyle} />
        </div>
      </div>

      <button className="w-full flex items-center justify-center gap-2 rounded-2xl py-3 text-sm font-medium transition-all" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: '#EF4444' }} onClick={async () => { await signOut(); window.location.href = '/login'; }}>
        <LogOut className="h-4 w-4" /> Sign Out
      </button>
    </div>
  );
}
