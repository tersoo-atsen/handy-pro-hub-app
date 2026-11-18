'use client';

import { User, Mail, Phone, MapPin, Camera, Wrench, Star, LogOut, Loader2 } from 'lucide-react';
import { useUser } from '@/hooks/use-user';
import { signOut } from '@/features/auth/services/auth-service';
import { getArtisanProfile, updateArtisanProfile } from '@/features/artisans/services/artisan-service';
import { updateProfile } from '@/features/profiles/services/profile-service';
import { useState, useEffect } from 'react';

export default function ArtisanProfilePage() {
  const inputStyle = {
    background: 'var(--color-bg-secondary)',
    border: '1px solid var(--color-border)',
    color: 'var(--color-text)',
  };

  const { profile, isLoading } = useUser();

  const [saving, setSaving] = useState(false);
  const [savingProfessional, setSavingProfessional] = useState(false);
  const [prevProfileId, setPrevProfileId] = useState<string | undefined>(profile?.id);
  const [formData, setFormData] = useState({
    fullName: profile?.full_name || '',
    phone: profile?.phone || '',
    address: profile?.address || '',
    city: profile?.city || '',
    state: profile?.state || '',
  });
  const [professionalData, setProfessionalData] = useState({
    bio: '',
    hourlyRate: '',
    yearsExperience: '',
    serviceRadiusKm: '10',
    ratingAvg: 0,
    ratingCount: 0,
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

      getArtisanProfile(profile.id).then(({ data }) => {
        if (data) {
          setProfessionalData({
            bio: data.bio ?? '',
            hourlyRate: data.hourly_rate != null ? String(data.hourly_rate) : '',
            yearsExperience: data.years_experience != null ? String(data.years_experience) : '',
            serviceRadiusKm: data.service_radius_km != null ? String(data.service_radius_km) : '10',
            ratingAvg: Number(data.rating_avg ?? 0),
            ratingCount: Number(data.rating_count ?? 0),
          });
        }
      });
    }
  }, [profile, prevProfileId]);

  const handleSaveProfessional = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSavingProfessional(true);
    await updateArtisanProfile(profile.id, {
      bio: professionalData.bio,
      hourly_rate: professionalData.hourlyRate ? Number(professionalData.hourlyRate) : undefined,
      years_experience: professionalData.yearsExperience ? Number(professionalData.yearsExperience) : undefined,
      service_radius_km: professionalData.serviceRadiusKm ? Number(professionalData.serviceRadiusKm) : undefined,
    });
    setSavingProfessional(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    const { error } = await updateProfile(profile.id, {
      full_name: formData.fullName,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      state: formData.state,
    });
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
      <div className="rounded-md p-6 flex items-center gap-6" style={{ background: 'var(--color-surface)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border-light)' }}>
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
            <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              {professionalData.ratingAvg.toFixed(1)} rating · {professionalData.ratingCount} reviews
            </span>
          </div>
        </div>
      </div>

      {/* Personal info */}
      <div className="rounded-md p-6 space-y-5" style={{ background: 'var(--color-surface)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border-light)' }}>
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
              className="w-full rounded-md pl-11 pr-4 py-3 text-sm outline-none"
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
              className="w-full rounded-md pl-11 pr-4 py-3 text-sm outline-none opacity-60"
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
              className="w-full rounded-md pl-11 pr-4 py-3 text-sm outline-none"
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
              className="w-full rounded-md pl-11 pr-4 py-3 text-sm outline-none"
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
              className="w-full rounded-md pl-11 pr-4 py-3 text-sm outline-none"
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
              className="w-full rounded-md pl-11 pr-4 py-3 text-sm outline-none"
              style={inputStyle}
            />
          </div>
        </div>
        <button
          type="button"
          disabled={saving}
          onClick={handleSave}
          className="w-full flex items-center justify-center gap-2 rounded-md py-3 text-sm font-semibold text-white gradient-primary hover:scale-[1.02] transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
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
      <div className="rounded-md p-6 space-y-5" style={{ background: 'var(--color-surface)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border-light)' }}>
        <h3 className="font-semibold" style={{ fontFamily: 'var(--font-outfit)' }}>Professional Details</h3>
        <div>
          <label className="block text-sm font-medium mb-2">Bio</label>
          <textarea
            rows={3}
            placeholder="Tell customers about your experience..."
            value={professionalData.bio}
            onChange={(e) => setProfessionalData({ ...professionalData, bio: e.target.value })}
            className="w-full rounded-md px-4 py-3 text-sm outline-none resize-none"
            style={inputStyle}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Hourly Rate (₦)</label>
            <input
              type="number"
              placeholder="5,000"
              value={professionalData.hourlyRate}
              onChange={(e) => setProfessionalData({ ...professionalData, hourlyRate: e.target.value })}
              className="w-full rounded-md px-4 py-3 text-sm outline-none"
              style={inputStyle}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Years of Experience</label>
            <input
              type="number"
              placeholder="5"
              value={professionalData.yearsExperience}
              onChange={(e) => setProfessionalData({ ...professionalData, yearsExperience: e.target.value })}
              className="w-full rounded-md px-4 py-3 text-sm outline-none"
              style={inputStyle}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Service Radius (km)</label>
          <input
            type="number"
            placeholder="10"
            value={professionalData.serviceRadiusKm}
            onChange={(e) => setProfessionalData({ ...professionalData, serviceRadiusKm: e.target.value })}
            className="w-full rounded-md px-4 py-3 text-sm outline-none"
            style={inputStyle}
          />
        </div>
        <button
          type="button"
          disabled={savingProfessional}
          onClick={handleSaveProfessional}
          className="w-full flex items-center justify-center gap-2 rounded-md py-3 text-sm font-semibold text-white gradient-primary hover:scale-[1.02] transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
          style={{ boxShadow: 'var(--shadow-md)' }}
        >
          {savingProfessional ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Saving...
            </>
          ) : (
            'Save Professional Details'
          )}
        </button>
      </div>

      <button className="w-full flex items-center justify-center gap-2 rounded-md py-3 text-sm font-medium transition-all" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: '#EF4444' }} onClick={async () => { await signOut(); window.location.href = '/login'; }}>
        <LogOut className="h-4 w-4" /> Sign Out
      </button>
    </div>
  );
}
