'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, MapPin, MessageSquare, Search, Star, Wrench } from 'lucide-react';
import { PublicNavbar } from '@/components/public-navbar';
import { PublicFooter } from '@/components/public-footer';
import { useUser } from '@/hooks/use-user';
import { useGeolocation } from '@/hooks/use-geolocation';
import { getAllCategories, searchArtisans } from '@/features/search/services/search-service';
import { getOrCreateConversation } from '@/features/messaging/services/message-service';
import { VerificationBadge } from '@/features/artisans/components/verification-badge';
import type { CategoryItem, SearchResult } from '@/features/search/types';

export default function ProfessionalsPage() {
  const router = useRouter();
  const { profile } = useUser();
  const { latitude, longitude, isLoading: geoLoading, refresh: refreshLocation } = useGeolocation();

  const [categories, setCategories] = useState<Array<{ name: string; slug: string }>>([]);
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'rating' | 'distance' | 'price'>('rating');
  const [artisans, setArtisans] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(true);
  const [messagingUserId, setMessagingUserId] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get('category');
    if (cat) setSelectedCategory(cat);

    getAllCategories().then(({ data }) => {
      if (Array.isArray(data)) {
        setCategories(data.map((c: CategoryItem) => ({ name: c.name, slug: c.slug })));
      }
    });
  }, []);

  useEffect(() => {
    setSearching(true);
    searchArtisans({
      latitude,
      longitude,
      category: selectedCategory === 'all' ? undefined : selectedCategory,
      query: query.trim() || undefined,
      sortBy,
    })
      .then(({ data }) => {
        setArtisans(data ?? []);
      })
      .catch(() => {
        setArtisans([]);
      })
      .finally(() => {
        setSearching(false);
      });
  }, [latitude, longitude, selectedCategory, query, sortBy]);

  const handleMessage = async (artisanUserId: string) => {
    if (!profile?.id) {
      router.push('/login');
      return;
    }
    setMessagingUserId(artisanUserId);
    const { data } = await getOrCreateConversation({
      participant_1: profile.id,
      participant_2: artisanUserId,
    });
    setMessagingUserId(null);
    if (data?.id) {
      router.push(`/customer/messages?conversationId=${encodeURIComponent(data.id)}`);
    } else {
      router.push('/customer/messages');
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--color-bg)' }}>
      <PublicNavbar />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Find a professional</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
              Browse verified artisans and technicians by skill, rating, or distance.
            </p>
          </div>

          {(latitude === null || longitude === null) && (
            <button
              type="button"
              onClick={refreshLocation}
              disabled={geoLoading}
              className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-xs font-semibold text-white gradient-primary disabled:opacity-60 self-start"
            >
              {geoLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <MapPin className="h-3.5 w-3.5" />}
              Use My Location
            </button>
          )}
        </div>

        {/* Search & Filter Controls */}
        <div
          className="rounded-md p-4 grid grid-cols-1 md:grid-cols-4 gap-3 shadow-card"
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border-light)',
          }}
        >
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'var(--color-text-tertiary)' }} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Name, skill or area..."
              className="w-full rounded-md pl-10 pr-4 py-2.5 text-sm outline-none"
              style={{
                background: 'var(--color-bg-secondary)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text)',
              }}
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-md px-3.5 py-2.5 text-sm outline-none"
            style={{
              background: 'var(--color-bg-secondary)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text)',
            }}
          >
            <option value="all">All categories</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>{c.name}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'rating' | 'distance' | 'price')}
            className="rounded-md px-3.5 py-2.5 text-sm outline-none"
            style={{
              background: 'var(--color-bg-secondary)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text)',
            }}
          >
            <option value="rating">Highest rated</option>
            <option value="distance">Nearest first</option>
            <option value="price">Lowest hourly rate</option>
          </select>
        </div>

        {/* Results */}
        {searching ? (
          <div
            className="rounded-md p-12 text-center shadow-card"
            style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-light)' }}
          >
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3" style={{ color: 'var(--color-primary)' }} />
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Loading professionals...</p>
          </div>
        ) : artisans.length === 0 ? (
          <div
            className="rounded-md p-12 text-center shadow-card"
            style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-light)' }}
          >
            <Wrench className="h-10 w-10 mx-auto mb-3" style={{ color: 'var(--color-primary)' }} />
            <h3 className="text-base font-bold mb-1">No professionals found</h3>
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              Try clearing your filters or searching another category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {artisans.map((artisan) => (
              <div
                key={artisan.artisan_id}
                className="rounded-md p-5 space-y-4 shadow-card flex flex-col justify-between"
                style={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border-light)',
                }}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="h-12 w-12 rounded-full flex items-center justify-center shrink-0"
                        style={{ background: 'var(--color-primary-50)' }}
                      >
                        <Wrench className="h-5 w-5" style={{ color: 'var(--color-primary)' }} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-bold truncate">{artisan.full_name}</h3>
                          <VerificationBadge verified={artisan.is_verified} />
                        </div>
                        <div className="flex items-center gap-2 text-xs mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>
                          <span className="inline-flex items-center gap-1">
                            <Star className="h-3.5 w-3.5" style={{ color: '#F59E0B', fill: '#F59E0B' }} />
                            {Number(artisan.rating_avg ?? 0).toFixed(1)} ({artisan.rating_count ?? 0})
                          </span>
                          {artisan.distance_km != null && (
                            <>
                              <span>·</span>
                              <span>{artisan.distance_km} km away</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    {artisan.hourly_rate != null && (
                      <span className="text-xs font-bold shrink-0" style={{ color: 'var(--color-primary)' }}>
                        ₦{Number(artisan.hourly_rate).toLocaleString()}/hr
                      </span>
                    )}
                  </div>

                  {artisan.bio && (
                    <p className="text-xs line-clamp-2" style={{ color: 'var(--color-text-secondary)' }}>
                      {artisan.bio}
                    </p>
                  )}

                  {Array.isArray(artisan.skills) && artisan.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {artisan.skills.map((skill) => (
                        <span
                          key={skill.skill_id}
                          className="rounded-full px-2.5 py-0.5 text-[11px] font-medium"
                          style={{ background: 'var(--color-primary-50)', color: 'var(--color-primary)' }}
                        >
                          {skill.skill_name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  disabled={messagingUserId === artisan.user_id || artisan.user_id === profile?.id}
                  onClick={() => handleMessage(artisan.user_id)}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-md py-2.5 text-xs font-semibold text-white gradient-primary disabled:opacity-60"
                >
                  {messagingUserId === artisan.user_id ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <MessageSquare className="h-3.5 w-3.5" />
                  )}
                  {profile ? 'Message Professional' : 'Sign in to Message'}
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      <PublicFooter />
    </div>
  );
}
