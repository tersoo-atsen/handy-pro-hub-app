'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  CalendarCheck,
  Handshake,
  MapPin,
  MessageCircle,
  Search,
  ShieldCheck,
  Star,
  Users,
  Wrench,
} from 'lucide-react';
import { PublicNavbar } from '@/components/public-navbar';
import { PublicFooter } from '@/components/public-footer';
import { getAllCategories } from '@/features/search/services/search-service';
import { findNearbyArtisans } from '@/features/artisans/services/artisan-service';
import { VerificationBadge } from '@/features/artisans/components/verification-badge';
import type { CategoryItem, SearchResult } from '@/features/search/types';

const fallbackCategories: Array<{ name: string; slug: string; description: string }> = [
  { name: 'Plumbing', slug: 'plumbing', description: 'Pipe repairs, installations, and leak detection' },
  { name: 'Electrical', slug: 'electrical', description: 'Wiring, circuit breakers, and lighting setup' },
  { name: 'Carpentry', slug: 'carpentry', description: 'Furniture making, doors, and woodwork' },
  { name: 'Painting', slug: 'painting', description: 'Interior and exterior painting services' },
  { name: 'Cleaning', slug: 'cleaning', description: 'Deep home and office cleaning' },
  { name: 'AC & Refrigeration', slug: 'ac-refrigeration', description: 'AC servicing, gas charging, and repairs' },
  { name: 'Tiling', slug: 'tiling', description: 'Floor, wall, and bathroom tiling' },
  { name: 'Welding', slug: 'welding', description: 'Gate fabrication and structural welding' },
];

const howItWorksSteps = [
  {
    step: '1. Search a service',
    description: 'Browse verified categories or search for the exact skill you need.',
    icon: Search,
  },
  {
    step: '2. Compare professionals',
    description: 'Review ratings, hourly rates, skills, and verification badges.',
    icon: Users,
  },
  {
    step: '3. Request & schedule',
    description: 'Post a job request, receive bids, and confirm your booking.',
    icon: CalendarCheck,
  },
  {
    step: '4. Get it done & review',
    description: 'Track progress, message directly, and leave a verified review.',
    icon: Handshake,
  },
];

const whyChooseItems = [
  {
    title: 'Verified professionals',
    description: 'Artisans undergo ID and skill review before earning a Verified badge.',
    icon: ShieldCheck,
  },
  {
    title: 'Real customer ratings',
    description: 'Every review comes from a completed booking on the platform.',
    icon: Star,
  },
  {
    title: 'Instant direct contact',
    description: 'Chat directly with artisans in real time before and during the job.',
    icon: MessageCircle,
  },
  {
    title: 'Built for Makurdi',
    description: 'Tailored for Makurdi, Benue State and expanding across Nigeria.',
    icon: MapPin,
  },
];

export default function LandingPage() {
  const [categories, setCategories] = useState<Array<{ name: string; slug: string; description?: string | null }>>(
    fallbackCategories
  );
  const [artisans, setArtisans] = useState<SearchResult[]>([]);

  useEffect(() => {
    getAllCategories().then(({ data }) => {
      if (Array.isArray(data) && data.length > 0) {
        setCategories(data.map((c: CategoryItem) => ({ name: c.name, slug: c.slug, description: c.description })));
      }
    });

    findNearbyArtisans().then(({ data }) => {
      if (Array.isArray(data)) {
        const sorted = [...data].sort(
          (a, b) => Number(b.rating_avg ?? 0) - Number(a.rating_avg ?? 0)
        );
        setArtisans(sorted.slice(0, 6));
      }
    });
  }, []);

  const verifiedCount = artisans.filter((a) => a.is_verified).length;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--color-bg)' }}>
      <PublicNavbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="gradient-hero py-14 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Column */}
              <div className="space-y-6 animate-fade-in">
                <div
                  className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold"
                  style={{ background: 'var(--color-primary-50)', color: 'var(--color-primary)' }}
                >
                  <MapPin className="h-3.5 w-3.5" />
                  Verified artisans in Makurdi, Benue State
                </div>

                <h1
                  className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.12]"
                  style={{ fontFamily: 'var(--font-jakarta), var(--font-outfit)' }}
                >
                  Find the Right Professional.{' '}
                  <span style={{ color: 'var(--color-primary)' }}>Get the Job Done.</span>
                </h1>

                <p className="text-base leading-relaxed max-w-xl" style={{ color: 'var(--color-text-secondary)' }}>
                  Connect with vetted plumbers, electricians, carpenters, mechanics, and technicians across Makurdi. Compare ratings, message directly, and hire with confidence.
                </p>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
                  <Link
                    href="/professionals"
                    className="inline-flex items-center justify-center gap-2 rounded-md px-6 h-12 text-sm font-semibold text-white gradient-primary shadow-card transition-transform hover:scale-[1.02]"
                  >
                    Find a Professional
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/register/artisan"
                    className="inline-flex items-center justify-center gap-2 rounded-md px-6 h-12 text-sm font-semibold text-white shadow-card transition-transform hover:scale-[1.02]"
                    style={{ backgroundColor: 'var(--color-brand-blue)' }}
                  >
                    Become a Professional
                  </Link>
                </div>

                {/* Stats Row */}
                <div
                  className="pt-6 grid grid-cols-3 gap-6 max-w-md"
                  style={{ borderTop: '1px solid var(--color-border)' }}
                >
                  <div>
                    <p className="text-xl font-extrabold">{verifiedCount > 0 ? `${verifiedCount}+` : `${artisans.length}+`}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>Verified pros</p>
                  </div>
                  <div>
                    <p className="text-xl font-extrabold">{categories.length}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>Service categories</p>
                  </div>
                  <div>
                    <p className="text-xl font-extrabold">Makurdi</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>City coverage</p>
                  </div>
                </div>
              </div>

              {/* Right Column - Visual Hero Card */}
              <div className="relative">
                <div
                  className="rounded-md overflow-hidden shadow-lift relative aspect-square max-w-lg mx-auto flex flex-col justify-between p-8"
                  style={{
                    background: 'linear-gradient(135deg, #FFF7ED 0%, #EEF6FC 100%)',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
                      style={{ background: 'var(--color-surface)', color: 'var(--color-primary)' }}
                    >
                      <Wrench className="h-3.5 w-3.5" />
                      Skilled Trades
                    </span>
                    <VerificationBadge verified />
                  </div>

                  <div className="my-auto py-8 text-center space-y-4">
                    <div
                      className="mx-auto h-20 w-20 rounded-md gradient-primary flex items-center justify-center text-white shadow-card"
                    >
                      <Wrench className="h-10 w-10" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-lg font-bold">Trusted Local Experts</p>
                      <p className="text-xs max-w-xs mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
                        Plumbing, Electrical, Carpentry, AC Repair, Tiling &amp; more — ready when you need them.
                      </p>
                    </div>
                  </div>

                  {/* Frosted Bottom-Left Verification Card */}
                  <div
                    className="rounded-md p-4 backdrop-blur-md shadow-card"
                    style={{
                      background: 'rgba(255, 255, 255, 0.92)',
                      border: '1px solid var(--color-border-light)',
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="h-9 w-9 rounded-md flex items-center justify-center shrink-0"
                        style={{ background: 'var(--color-brand-blue-soft)', color: 'var(--color-brand-blue)' }}
                      >
                        <ShieldCheck className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold">ID &amp; skill verified</p>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>
                          Every professional is reviewed by our team before going live.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Popular Services */}
        <section className="py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Popular services</h2>
                <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                  Pick a category and see the professionals available near you.
                </p>
              </div>
              <Link
                href="/services"
                className="inline-flex items-center gap-1.5 text-sm font-semibold shrink-0"
                style={{ color: 'var(--color-primary)' }}
              >
                View all services
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {categories.slice(0, 8).map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/professionals?category=${encodeURIComponent(cat.slug)}`}
                  className="rounded-md p-5 transition-all hover:scale-[1.01] shadow-card block"
                  style={{
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border-light)',
                  }}
                >
                  <div
                    className="h-10 w-10 rounded-md flex items-center justify-center mb-3"
                    style={{ background: 'var(--color-primary-50)', color: 'var(--color-primary)' }}
                  >
                    <Wrench className="h-5 w-5" />
                  </div>
                  <h3 className="text-sm font-bold">{cat.name}</h3>
                  {cat.description && (
                    <p className="text-xs mt-1 line-clamp-2" style={{ color: 'var(--color-text-secondary)' }}>
                      {cat.description}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* How HandyPro Hub Works */}
        <section
          className="py-14"
          style={{
            background: 'var(--color-surface)',
            borderTop: '1px solid var(--color-border)',
            borderBottom: '1px solid var(--color-border)',
          }}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                How HandyPro Hub works
              </h2>
              <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                Get your job done in 4 simple steps
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {howItWorksSteps.map((item) => (
                <div key={item.step} className="space-y-3">
                  <div className="h-11 w-11 rounded-md gradient-primary flex items-center justify-center text-white shadow-card">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-sm font-bold">{item.step}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Top-Rated Professionals */}
        <section className="py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Top-rated professionals
                </h2>
                <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                  Highest rated verified artisans on the platform right now.
                </p>
              </div>
              <Link
                href="/professionals"
                className="inline-flex items-center gap-1.5 text-sm font-semibold shrink-0"
                style={{ color: 'var(--color-primary)' }}
              >
                Browse all
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {artisans.length === 0 ? (
              <div
                className="rounded-md p-10 text-center shadow-card"
                style={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border-light)',
                }}
              >
                <p className="text-sm font-medium mb-2">Professionals are joining daily</p>
                <p className="text-xs mb-5" style={{ color: 'var(--color-text-secondary)' }}>
                  Explore the directory or post a job request to get bids from local artisans.
                </p>
                <Link
                  href="/professionals"
                  className="inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-xs font-semibold text-white gradient-primary"
                >
                  Explore Professionals
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {artisans.map((artisan) => (
                  <div
                    key={artisan.artisan_id}
                    className="rounded-md p-5 space-y-3 shadow-card"
                    style={{
                      background: 'var(--color-surface)',
                      border: '1px solid var(--color-border-light)',
                    }}
                  >
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
                          <p className="text-xs mt-0.5 inline-flex items-center gap-1" style={{ color: 'var(--color-text-secondary)' }}>
                            <Star className="h-3.5 w-3.5" style={{ color: '#F59E0B', fill: '#F59E0B' }} />
                            {Number(artisan.rating_avg ?? 0).toFixed(1)} ({artisan.rating_count ?? 0})
                          </p>
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

                    <Link
                      href="/professionals"
                      className="inline-flex items-center gap-1 text-xs font-semibold"
                      style={{ color: 'var(--color-brand-blue)' }}
                    >
                      View profile
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Why Choose HandyPro Hub */}
        <section
          className="py-14"
          style={{
            background: 'var(--color-surface)',
            borderTop: '1px solid var(--color-border)',
            borderBottom: '1px solid var(--color-border)',
          }}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Why choose HandyPro Hub
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {whyChooseItems.map((item) => (
                <div
                  key={item.title}
                  className="rounded-md p-5 shadow-card space-y-3"
                  style={{
                    background: 'var(--color-bg)',
                    border: '1px solid var(--color-border-light)',
                  }}
                >
                  <div
                    className="h-10 w-10 rounded-full flex items-center justify-center"
                    style={{ background: 'var(--color-brand-blue-soft)', color: 'var(--color-brand-blue)' }}
                  >
                    <item.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-sm font-bold">{item.title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA Banner */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div
              className="rounded-md p-10 sm:p-14 text-center text-white shadow-lift space-y-4"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Ready to get your job done?
              </h2>
              <p className="text-sm sm:text-base max-w-2xl mx-auto opacity-90">
                Tell us what you need and we&apos;ll match you with a verified professional in Makurdi.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/customer/jobs/new"
                  className="inline-flex items-center justify-center gap-2 rounded-md px-6 h-11 text-sm font-semibold transition-transform hover:scale-[1.02]"
                  style={{
                    background: 'rgba(255,255,255,0.16)',
                    border: '1px solid rgba(255,255,255,0.45)',
                    color: '#FFFFFF',
                  }}
                >
                  Request a service
                </Link>
                <Link
                  href="/professionals"
                  className="inline-flex items-center justify-center gap-2 rounded-md px-6 h-11 text-sm font-semibold transition-transform hover:scale-[1.02]"
                  style={{
                    background: '#FFFFFF',
                    color: 'var(--color-primary-dark)',
                  }}
                >
                  Browse professionals
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
