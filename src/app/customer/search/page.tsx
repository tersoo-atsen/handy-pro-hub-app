'use client';

import { useEffect, useState } from 'react';
import { Search, MapPin, Star, Wrench, Loader2 } from 'lucide-react';
import { useGeolocation } from '@/hooks/use-geolocation';
import { getAllCategories, searchArtisans } from '@/features/search/services/search-service';
import type { CategoryItem, SearchResult } from '@/features/search/types';

const fallbackCategories: Array<{ name: string; slug: string }> = [
  { name: 'Plumbing', slug: 'plumbing' },
  { name: 'Electrical', slug: 'electrical' },
  { name: 'Carpentry', slug: 'carpentry' },
  { name: 'Painting', slug: 'painting' },
  { name: 'Cleaning', slug: 'cleaning' },
  { name: 'AC & Refrigeration', slug: 'ac-refrigeration' },
  { name: 'Tiling', slug: 'tiling' },
  { name: 'Welding', slug: 'welding' },
];

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [categories, setCategories] = useState<Array<{ name: string; slug: string }>>(fallbackCategories);
  const [artisans, setArtisans] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);

  const { latitude, longitude, isLoading: geoLoading, refresh: refreshLocation } = useGeolocation();

  useEffect(() => {
    getAllCategories().then(({ data }) => {
      if (Array.isArray(data) && data.length > 0) {
        setCategories(data.map((c: CategoryItem) => ({ name: c.name, slug: c.slug })));
      }
    });
  }, []);

  useEffect(() => {
    if (latitude === null || longitude === null) return;
    setSearching(true);
    searchArtisans({
      latitude,
      longitude,
      category: selectedCategory === 'all' ? undefined : selectedCategory,
      query: query.trim() || undefined,
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
  }, [latitude, longitude, selectedCategory, query]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-outfit)' }}>Find Artisans</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>Search for skilled professionals near you</p>
      </div>

      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5" style={{ color: 'var(--color-text-tertiary)' }} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by skill, name, or keyword..."
          className="w-full rounded-2xl pl-12 pr-4 py-4 text-sm outline-none transition-all"
          style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text)', boxShadow: 'var(--shadow-sm)' }}
        />
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setSelectedCategory('all')}
          className="rounded-full px-4 py-2 text-sm font-medium transition-all"
          style={{
            background: selectedCategory === 'all' ? 'var(--color-primary)' : 'var(--color-surface)',
            color: selectedCategory === 'all' ? 'white' : 'var(--color-text-secondary)',
            border: `1px solid ${selectedCategory === 'all' ? 'var(--color-primary)' : 'var(--color-border)'}`,
          }}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.slug}
            type="button"
            onClick={() => setSelectedCategory(cat.slug)}
            className="rounded-full px-4 py-2 text-sm font-medium transition-all"
            style={{
              background: selectedCategory === cat.slug ? 'var(--color-primary)' : 'var(--color-surface)',
              color: selectedCategory === cat.slug ? 'white' : 'var(--color-text-secondary)',
              border: `1px solid ${selectedCategory === cat.slug ? 'var(--color-primary)' : 'var(--color-border)'}`,
            }}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Results / Empty states */}
      {latitude === null || longitude === null ? (
        <div
          className="rounded-2xl p-12 text-center"
          style={{ background: 'var(--color-surface)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border-light)' }}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ background: 'var(--color-primary-50)' }}>
            <MapPin className="h-8 w-8" style={{ color: 'var(--color-primary)' }} />
          </div>
          <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: 'var(--font-outfit)' }}>Enable Location</h3>
          <p className="mb-6" style={{ color: 'var(--color-text-secondary)' }}>Allow location access to find artisans near you</p>
          <button
            type="button"
            onClick={refreshLocation}
            disabled={geoLoading}
            className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white gradient-primary disabled:opacity-60"
          >
            {geoLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
            Enable Location
          </button>
        </div>
      ) : searching ? (
        <div
          className="rounded-2xl p-12 text-center"
          style={{ background: 'var(--color-surface)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border-light)' }}
        >
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3" style={{ color: 'var(--color-primary)' }} />
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Searching nearby artisans...</p>
        </div>
      ) : artisans.length === 0 ? (
        <div
          className="rounded-2xl p-12 text-center"
          style={{ background: 'var(--color-surface)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border-light)' }}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ background: 'var(--color-primary-50)' }}>
            <Wrench className="h-8 w-8" style={{ color: 'var(--color-primary)' }} />
          </div>
          <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: 'var(--font-outfit)' }}>No artisans found nearby</h3>
          <p style={{ color: 'var(--color-text-secondary)' }}>Try selecting a different category or broadening your search</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {artisans.map((artisan) => (
            <div
              key={artisan.artisan_id}
              className="rounded-2xl p-5 space-y-4 transition-all hover:scale-[1.01]"
              style={{ background: 'var(--color-surface)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border-light)' }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full flex items-center justify-center" style={{ background: 'var(--color-primary-50)' }}>
                    <Wrench className="h-6 w-6" style={{ color: 'var(--color-primary)' }} />
                  </div>
                  <div>
                    <h3 className="font-semibold" style={{ fontFamily: 'var(--font-outfit)' }}>{artisan.full_name}</h3>
                    <div className="flex items-center gap-2 text-xs mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>
                      <span className="inline-flex items-center gap-1">
                        <Star className="h-3.5 w-3.5" style={{ color: '#F59E0B' }} />
                        {Number(artisan.rating_avg ?? 0).toFixed(1)} ({artisan.rating_count ?? 0})
                      </span>
                      <span>·</span>
                      <span>{artisan.distance_km} km away</span>
                    </div>
                  </div>
                </div>
                {artisan.hourly_rate != null && (
                  <span className="text-sm font-semibold" style={{ color: 'var(--color-primary)' }}>
                    ₦{Number(artisan.hourly_rate).toLocaleString()}/hr
                  </span>
                )}
              </div>

              {artisan.bio && (
                <p className="text-sm line-clamp-2" style={{ color: 'var(--color-text-secondary)' }}>
                  {artisan.bio}
                </p>
              )}

              {Array.isArray(artisan.skills) && artisan.skills.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {artisan.skills.map((skill) => (
                    <span
                      key={skill.skill_id}
                      className="rounded-full px-2.5 py-0.5 text-xs font-medium"
                      style={{ background: 'var(--color-primary-50)', color: 'var(--color-primary)' }}
                    >
                      {skill.skill_name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
