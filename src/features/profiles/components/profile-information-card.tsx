'use client';

import { useEffect, useState } from 'react';
import { Camera, Loader2, Pencil, Star, User, Wrench, X } from 'lucide-react';
import type { UserProfile } from '@/hooks/use-user';
import { updateProfile } from '@/features/profiles/services/profile-service';
import { updateArtisanProfile } from '@/features/artisans/services/artisan-service';
import { getAllCategories } from '@/features/search/services/search-service';
import { VerificationBadge } from '@/features/artisans/components/verification-badge';
import type { CategoryItem } from '@/features/search/types';

export interface ArtisanDetailsState {
  bio: string;
  hourlyRate: string;
  yearsExperience: string;
  serviceRadiusKm: string;
  categorySlug?: string;
  categoryName?: string;
  ratingAvg: number;
  ratingCount: number;
  verifiedAt: string | null;
}

interface ProfileInformationCardProps {
  profile: UserProfile;
  isArtisan?: boolean;
  artisanDetails?: ArtisanDetailsState;
  onArtisanDetailsUpdated?: (next: ArtisanDetailsState) => void;
}

function splitFullName(fullName: string): { firstName: string; lastName: string } {
  const parts = (fullName || '').trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { firstName: '', lastName: '' };
  if (parts.length === 1) return { firstName: parts[0], lastName: '' };
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(' '),
  };
}

export function ProfileInformationCard({
  profile,
  isArtisan = false,
  artisanDetails,
  onArtisanDetailsUpdated,
}: ProfileInformationCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const initialNames = splitFullName(profile.full_name);
  const [formData, setFormData] = useState({
    firstName: initialNames.firstName,
    lastName: initialNames.lastName,
    phone: profile.phone || '',
    address: profile.address || '',
    city: profile.city || '',
    state: profile.state || '',
    country: profile.country || 'Nigeria',
  });

  const [proData, setProData] = useState<ArtisanDetailsState>({
    bio: artisanDetails?.bio ?? '',
    hourlyRate: artisanDetails?.hourlyRate ?? '',
    yearsExperience: artisanDetails?.yearsExperience ?? '',
    serviceRadiusKm: artisanDetails?.serviceRadiusKm ?? '10',
    categorySlug: artisanDetails?.categorySlug ?? '',
    categoryName: artisanDetails?.categoryName ?? '',
    ratingAvg: artisanDetails?.ratingAvg ?? 0,
    ratingCount: artisanDetails?.ratingCount ?? 0,
    verifiedAt: artisanDetails?.verifiedAt ?? null,
  });
  const [categories, setCategories] = useState<CategoryItem[]>([]);

  useEffect(() => {
    if (!isArtisan) return;
    getAllCategories().then(({ data }) => {
      if (Array.isArray(data)) {
        setCategories(data);
      }
    });
  }, [isArtisan]);

  useEffect(() => {
    const names = splitFullName(profile.full_name);
    setFormData({
      firstName: names.firstName,
      lastName: names.lastName,
      phone: profile.phone || '',
      address: profile.address || '',
      city: profile.city || '',
      state: profile.state || '',
      country: profile.country || 'Nigeria',
    });
  }, [profile]);

  useEffect(() => {
    if (artisanDetails) {
      setProData(artisanDetails);
    }
  }, [artisanDetails]);

  const handleCancel = () => {
    const names = splitFullName(profile.full_name);
    setFormData({
      firstName: names.firstName,
      lastName: names.lastName,
      phone: profile.phone || '',
      address: profile.address || '',
      city: profile.city || '',
      state: profile.state || '',
      country: profile.country || 'Nigeria',
    });
    if (artisanDetails) {
      setProData(artisanDetails);
    }
    setIsEditing(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const fullName = [formData.firstName.trim(), formData.lastName.trim()]
      .filter(Boolean)
      .join(' ');

    await updateProfile(profile.id, {
      full_name: fullName || profile.full_name,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      country: formData.country,
    });

    if (isArtisan) {
      const selectedCat = categories.find((c) => c.slug === proData.categorySlug);
      const nextProData: ArtisanDetailsState = {
        ...proData,
        categoryName: selectedCat?.name ?? proData.categoryName,
      };
      await updateArtisanProfile(profile.id, {
        bio: proData.bio,
        hourly_rate: proData.hourlyRate ? Number(proData.hourlyRate) : undefined,
        years_experience: proData.yearsExperience ? Number(proData.yearsExperience) : undefined,
        service_radius_km: proData.serviceRadiusKm ? Number(proData.serviceRadiusKm) : undefined,
        category_slug: proData.categorySlug || undefined,
      });
      setProData(nextProData);
      onArtisanDetailsUpdated?.(nextProData);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('handy-artisan-profile-updated'));
      }
    }

    setSaving(false);
    setIsEditing(false);
  };

  const displayBoxStyle = {
    background: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    color: 'var(--color-text)',
  };

  const editInputStyle = {
    background: 'var(--color-bg-secondary)',
    border: '1px solid var(--color-border)',
    color: 'var(--color-text)',
  };

  const renderField = (
    label: string,
    value: string,
    onChange?: (val: string) => void,
    options?: {
      type?: string;
      placeholder?: string;
      disabled?: boolean;
    }
  ) => (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>
        {label}
      </label>
      {isEditing && !options?.disabled && onChange ? (
        <input
          type={options?.type ?? 'text'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={options?.placeholder}
          className="w-full rounded-md px-3.5 py-2.5 text-sm outline-none transition-colors"
          style={editInputStyle}
        />
      ) : (
        <div
          className={`w-full rounded-md px-3.5 py-2.5 text-sm min-h-[42px] flex items-center ${
            options?.disabled && isEditing ? 'opacity-60' : ''
          }`}
          style={displayBoxStyle}
        >
          {value || <span style={{ color: 'var(--color-text-tertiary)' }}>—</span>}
        </div>
      )}
    </div>
  );

  const displayName =
    [formData.firstName, formData.lastName].filter(Boolean).join(' ') ||
    profile.full_name ||
    'Your Name';

  return (
    <form
      onSubmit={handleSave}
      className="rounded-md overflow-hidden"
      style={{
        background: 'var(--color-surface)',
        boxShadow: 'var(--shadow-sm)',
        border: '1px solid var(--color-border-light)',
      }}
    >
      {/* Top Header + Avatar Row */}
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-lg font-bold" style={{ fontFamily: 'var(--font-outfit)' }}>
            Profile Information
          </h1>

          {!isEditing ? (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold text-white transition-transform hover:scale-105"
              style={{ backgroundColor: '#2563EB' }}
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCancel}
                disabled={saving}
                className="inline-flex items-center gap-1 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors"
                style={{
                  background: 'var(--color-bg-secondary)',
                  color: 'var(--color-text-secondary)',
                  border: '1px solid var(--color-border)',
                }}
              >
                <X className="h-3.5 w-3.5" />
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold text-white gradient-primary disabled:opacity-60"
              >
                {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          )}
        </div>

        {/* Avatar & Name */}
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            <div
              className="h-16 w-16 rounded-full flex items-center justify-center overflow-hidden"
              style={{ background: 'var(--color-primary-50)' }}
            >
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={displayName}
                  className="h-full w-full object-cover"
                />
              ) : isArtisan ? (
                <Wrench className="h-7 w-7" style={{ color: 'var(--color-primary)' }} />
              ) : (
                <User className="h-7 w-7" style={{ color: 'var(--color-primary)' }} />
              )}
            </div>
            {isEditing && (
              <button
                type="button"
                className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full flex items-center justify-center text-white gradient-primary"
                style={{ boxShadow: 'var(--shadow-md)' }}
                aria-label="Change avatar"
              >
                <Camera className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-semibold truncate" style={{ fontFamily: 'var(--font-outfit)' }}>
                {displayName}
              </h2>
              {isArtisan && (
                <VerificationBadge verified={Boolean(profile.is_verified || proData.verifiedAt)} />
              )}
            </div>
            {isArtisan ? (
              <div className="flex items-center gap-1.5 mt-0.5 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                <Star className="h-3.5 w-3.5" style={{ color: '#F59E0B', fill: '#F59E0B' }} />
                <span>
                  {proData.ratingAvg.toFixed(1)} rating · {proData.ratingCount} reviews
                </span>
              </div>
            ) : (
              <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>
                Customer Account
              </p>
            )}
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--color-border-light)' }} />

      {/* Personal Details */}
      <div className="p-6 space-y-4">
        <h3 className="text-base font-semibold" style={{ fontFamily: 'var(--font-outfit)' }}>
          Personal Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderField('First Name', formData.firstName, (val) =>
            setFormData({ ...formData, firstName: val })
          )}
          {renderField('Last Name', formData.lastName, (val) =>
            setFormData({ ...formData, lastName: val })
          )}
          {renderField('Email address', profile.email || '', undefined, {
            type: 'email',
            disabled: true,
          })}
          {renderField(
            'Phone',
            formData.phone,
            (val) => setFormData({ ...formData, phone: val }),
            { type: 'tel', placeholder: '+234 800 000 0000' }
          )}

          {isArtisan && (
            <>
              <div className="space-y-1.5">
                <label className="block text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                  Profession
                </label>
                {isEditing ? (
                  <select
                    value={proData.categorySlug ?? ''}
                    onChange={(e) => {
                      const slug = e.target.value;
                      const match = categories.find((c) => c.slug === slug);
                      setProData({
                        ...proData,
                        categorySlug: slug,
                        categoryName: match?.name ?? '',
                      });
                    }}
                    className="w-full rounded-md px-3.5 py-2.5 text-sm outline-none"
                    style={editInputStyle}
                  >
                    <option value="">Select profession</option>
                    {categories.map((cat) => (
                      <option key={cat.slug} value={cat.slug}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div
                    className="w-full rounded-md px-3.5 py-2.5 text-sm min-h-[42px] flex items-center"
                    style={displayBoxStyle}
                  >
                    {proData.categoryName || <span style={{ color: 'var(--color-text-tertiary)' }}>—</span>}
                  </div>
                )}
              </div>
              {renderField(
                'Service Radius (km)',
                proData.serviceRadiusKm,
                (val) => setProData({ ...proData, serviceRadiusKm: val }),
                { type: 'number', placeholder: '10' }
              )}
              {renderField(
                'Hourly Rate (₦)',
                proData.hourlyRate,
                (val) => setProData({ ...proData, hourlyRate: val }),
                { type: 'number', placeholder: '5000' }
              )}
              {renderField(
                'Years of Experience',
                proData.yearsExperience,
                (val) => setProData({ ...proData, yearsExperience: val }),
                { type: 'number', placeholder: '5' }
              )}
              <div className="space-y-1.5 md:col-span-2">
                <label className="block text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                  Bio
                </label>
                {isEditing ? (
                  <textarea
                    rows={2}
                    value={proData.bio}
                    onChange={(e) => setProData({ ...proData, bio: e.target.value })}
                    placeholder="Tell customers about your experience..."
                    className="w-full rounded-md px-3.5 py-2.5 text-sm outline-none resize-none"
                    style={editInputStyle}
                  />
                ) : (
                  <div
                    className="w-full rounded-md px-3.5 py-2.5 text-sm min-h-[42px] flex items-center"
                    style={displayBoxStyle}
                  >
                    {proData.bio || <span style={{ color: 'var(--color-text-tertiary)' }}>—</span>}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--color-border-light)' }} />

      {/* Address */}
      <div className="p-6 space-y-4">
        <h3 className="text-base font-semibold" style={{ fontFamily: 'var(--font-outfit)' }}>
          Address
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderField('Country', formData.country, (val) =>
            setFormData({ ...formData, country: val })
          )}
          {renderField('City', formData.city, (val) =>
            setFormData({ ...formData, city: val })
          )}
          {renderField('State', formData.state, (val) =>
            setFormData({ ...formData, state: val })
          )}
          {renderField('Street Address', formData.address, (val) =>
            setFormData({ ...formData, address: val })
          )}
        </div>
      </div>
    </form>
  );
}
