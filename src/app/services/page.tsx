'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Loader2, Wrench } from 'lucide-react';
import { PublicNavbar } from '@/components/public-navbar';
import { PublicFooter } from '@/components/public-footer';
import { getAllCategories } from '@/features/search/services/search-service';
import type { CategoryItem } from '@/features/search/types';

const defaultCategories: CategoryItem[] = [
  { id: 'plumbing', name: 'Plumbing', slug: 'plumbing', description: 'Pipe repairs, installations, and water system maintenance', icon_url: null, is_active: true },
  { id: 'electrical', name: 'Electrical', slug: 'electrical', description: 'Wiring, installations, and electrical repairs', icon_url: null, is_active: true },
  { id: 'carpentry', name: 'Carpentry', slug: 'carpentry', description: 'Furniture making, repairs, and woodwork', icon_url: null, is_active: true },
  { id: 'painting', name: 'Painting', slug: 'painting', description: 'Interior and exterior painting services', icon_url: null, is_active: true },
  { id: 'cleaning', name: 'Cleaning', slug: 'cleaning', description: 'Home and office cleaning services', icon_url: null, is_active: true },
  { id: 'ac-refrigeration', name: 'AC & Refrigeration', slug: 'ac-refrigeration', description: 'Air conditioning and refrigerator repair', icon_url: null, is_active: true },
  { id: 'tiling', name: 'Tiling', slug: 'tiling', description: 'Floor and wall tiling services', icon_url: null, is_active: true },
  { id: 'welding', name: 'Welding', slug: 'welding', description: 'Metal fabrication and welding services', icon_url: null, is_active: true },
  { id: 'generator-repair', name: 'Generator Repair', slug: 'generator-repair', description: 'Generator servicing and repair', icon_url: null, is_active: true },
  { id: 'landscaping', name: 'Landscaping', slug: 'landscaping', description: 'Garden design, lawn care, and outdoor maintenance', icon_url: null, is_active: true },
];

export default function ServicesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>(defaultCategories);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllCategories()
      .then(({ data }) => {
        if (Array.isArray(data) && data.length > 0) {
          setCategories(data);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--color-bg)' }}>
      <PublicNavbar />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <div className="max-w-2xl space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight">Service categories</h1>
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            Explore all trades and technical services available on HandyPro Hub.
          </p>
        </div>

        {loading ? (
          <div className="py-16 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3" style={{ color: 'var(--color-primary)' }} />
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Loading services...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/professionals?category=${encodeURIComponent(cat.slug)}`}
                className="rounded-md p-6 space-y-3 shadow-card transition-all hover:scale-[1.01] block"
                style={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border-light)',
                }}
              >
                <div className="flex items-center justify-between">
                  <div
                    className="h-10 w-10 rounded-md flex items-center justify-center"
                    style={{ background: 'var(--color-primary-50)', color: 'var(--color-primary)' }}
                  >
                    <Wrench className="h-5 w-5" />
                  </div>
                  <ArrowRight className="h-4 w-4" style={{ color: 'var(--color-text-tertiary)' }} />
                </div>
                <h2 className="text-base font-bold">{cat.name}</h2>
                {cat.description && (
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                    {cat.description}
                  </p>
                )}
                {Array.isArray(cat.skills) && cat.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {cat.skills.slice(0, 4).map((skill) => (
                      <span
                        key={skill.id}
                        className="rounded-full px-2.5 py-0.5 text-[11px] font-medium"
                        style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text-secondary)' }}
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}

        <div
          className="rounded-md p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-card"
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border-light)',
          }}
        >
          <div>
            <h3 className="text-base font-bold">Can&apos;t find your service?</h3>
            <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
              Post a custom job request and let verified artisans send you bids.
            </p>
          </div>
          <Link
            href="/customer/jobs/new"
            className="inline-flex items-center justify-center gap-2 rounded-md px-5 py-2.5 text-sm font-semibold text-white gradient-primary shrink-0"
          >
            Request a Service
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
