'use client';

import { useState } from 'react';
import { Search, MapPin, Star, Filter } from 'lucide-react';

const categories = [
  'All', 'Plumbing', 'Electrical', 'Carpentry', 'Painting',
  'Cleaning', 'AC & Cooling', 'Tiling', 'Welding',
];

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

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
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className="rounded-full px-4 py-2 text-sm font-medium transition-all"
            style={{
              background: selectedCategory === cat ? 'var(--color-primary)' : 'var(--color-surface)',
              color: selectedCategory === cat ? 'white' : 'var(--color-text-secondary)',
              border: `1px solid ${selectedCategory === cat ? 'var(--color-primary)' : 'var(--color-border)'}`,
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Empty state */}
      <div
        className="rounded-2xl p-12 text-center"
        style={{ background: 'var(--color-surface)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border-light)' }}
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ background: 'var(--color-primary-50)' }}>
          <MapPin className="h-8 w-8" style={{ color: 'var(--color-primary)' }} />
        </div>
        <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: 'var(--font-outfit)' }}>Enable Location</h3>
        <p style={{ color: 'var(--color-text-secondary)' }}>Allow location access to find artisans near you</p>
      </div>
    </div>
  );
}
