import Link from 'next/link';
import { ArrowRight, MapPin, Star, Shield, Zap, Users, Clock, CheckCircle } from 'lucide-react';

const categories = [
  { name: 'Plumbing', slug: 'plumbing', icon: '🔧', color: 'from-blue-500 to-cyan-400' },
  { name: 'Electrical', slug: 'electrical', icon: '⚡', color: 'from-amber-500 to-yellow-400' },
  { name: 'Carpentry', slug: 'carpentry', icon: '🪚', color: 'from-orange-500 to-red-400' },
  { name: 'Painting', slug: 'painting', icon: '🎨', color: 'from-pink-500 to-rose-400' },
  { name: 'Cleaning', slug: 'cleaning', icon: '✨', color: 'from-emerald-500 to-green-400' },
  { name: 'AC & Cooling', slug: 'ac-refrigeration', icon: '❄️', color: 'from-sky-500 to-blue-400' },
  { name: 'Tiling', slug: 'tiling', icon: '🏗️', color: 'from-violet-500 to-purple-400' },
  { name: 'Welding', slug: 'welding', icon: '🔩', color: 'from-slate-500 to-gray-400' },
];

const stats = [
  { value: '2,500+', label: 'Verified Artisans' },
  { value: '15,000+', label: 'Jobs Completed' },
  { value: '4.8★', label: 'Average Rating' },
  { value: '<5min', label: 'Avg. Response Time' },
];

const steps = [
  {
    step: '01',
    title: 'Describe Your Job',
    description: 'Tell us what you need — from a leaky pipe to a full renovation. Add photos for accuracy.',
    icon: CheckCircle,
  },
  {
    step: '02',
    title: 'Get Instant Bids',
    description: 'Nearby verified artisans see your request and send competitive bids in real time.',
    icon: Zap,
  },
  {
    step: '03',
    title: 'Choose & Book',
    description: 'Compare ratings, reviews, and prices. Pick the best artisan and confirm your booking.',
    icon: Users,
  },
  {
    step: '04',
    title: 'Track & Pay',
    description: 'Track your artisan live. Pay securely when the job is done to your satisfaction.',
    icon: Shield,
  },
];

export default function LandingPage() {
  return (
    <main className="flex flex-col">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
                <span className="text-white font-bold text-sm">H</span>
              </div>
              <span className="text-xl font-bold" style={{ fontFamily: 'var(--font-outfit)' }}>
                Handy<span className="text-gradient">Pro</span>
              </span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#how-it-works" className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>How it Works</a>
              <a href="#categories" className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>Services</a>
              <Link href="/login" className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>Sign In</Link>
              <Link
                href="/register"
                className="rounded-full px-5 py-2 text-sm font-semibold text-white transition-all hover:scale-105 gradient-primary"
                style={{ boxShadow: 'var(--shadow-md)' }}
              >
                Get Started
              </Link>
            </div>
            <Link
              href="/register"
              className="md:hidden rounded-full px-4 py-2 text-sm font-semibold text-white gradient-primary"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Background gradient */}
        <div className="absolute inset-0 gradient-hero opacity-5" />
        <div
          className="absolute top-20 right-10 w-72 h-72 rounded-full opacity-20 blur-3xl"
          style={{ background: 'var(--color-primary)' }}
        />
        <div
          className="absolute bottom-20 left-10 w-96 h-96 rounded-full opacity-15 blur-3xl"
          style={{ background: 'var(--color-accent)' }}
        />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in">
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium mb-8"
              style={{ background: 'var(--color-primary-50)', color: 'var(--color-primary)' }}
            >
              <MapPin className="h-4 w-4" />
              Serving 25+ cities across Nigeria
            </div>

            <h1
              className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight mb-6"
              style={{ fontFamily: 'var(--font-outfit)' }}
            >
              Skilled Artisans,
              <br />
              <span className="text-gradient">At Your Doorstep</span>
            </h1>

            <p
              className="mx-auto max-w-2xl text-lg sm:text-xl mb-10 leading-relaxed"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              From emergency plumbing to home renovations — find verified professionals
              near you, get instant bids, and book with confidence.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="group inline-flex items-center gap-2 rounded-full px-8 py-4 text-lg font-semibold text-white transition-all hover:scale-105 gradient-primary"
                style={{ boxShadow: 'var(--shadow-lg)' }}
              >
                Find an Artisan
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/register/artisan"
                className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-lg font-semibold transition-all hover:scale-105"
                style={{
                  background: 'var(--color-surface)',
                  color: 'var(--color-text)',
                  boxShadow: 'var(--shadow-md)',
                  border: '1px solid var(--color-border)',
                }}
              >
                Join as a Pro
                <Star className="h-5 w-5" style={{ color: 'var(--color-primary)' }} />
              </Link>
            </div>
          </div>

          {/* Stats row */}
          <div
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 animate-slide-up"
            style={{ animationDelay: '0.3s' }}
          >
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl p-6 text-center transition-transform hover:scale-105"
                style={{ background: 'var(--color-surface)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border-light)' }}
              >
                <div className="text-3xl font-bold text-gradient" style={{ fontFamily: 'var(--font-outfit)' }}>
                  {stat.value}
                </div>
                <div className="mt-1 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="py-24" style={{ background: 'var(--color-bg-secondary)' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2
              className="text-3xl sm:text-4xl font-bold mb-4"
              style={{ fontFamily: 'var(--font-outfit)' }}
            >
              Every Service You Need
            </h2>
            <p className="text-lg" style={{ color: 'var(--color-text-secondary)' }}>
              Browse from 10+ categories of skilled professionals
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/search?category=${cat.slug}`}
                className="group relative overflow-hidden rounded-2xl p-6 text-center transition-all hover:scale-105 hover:-translate-y-1"
                style={{ background: 'var(--color-surface)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border-light)' }}
              >
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${cat.color} text-2xl mb-3`}>
                  {cat.icon}
                </div>
                <h3 className="font-semibold text-sm">{cat.name}</h3>
                <div
                  className="absolute inset-x-0 bottom-0 h-1 transition-all duration-300 opacity-0 group-hover:opacity-100 bg-gradient-to-r"
                  style={{ background: 'var(--color-primary)' }}
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2
              className="text-3xl sm:text-4xl font-bold mb-4"
              style={{ fontFamily: 'var(--font-outfit)' }}
            >
              How It Works
            </h2>
            <p className="text-lg" style={{ color: 'var(--color-text-secondary)' }}>
              Get your job done in 4 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((item) => (
              <div key={item.step} className="relative group">
                <div
                  className="rounded-2xl p-8 h-full transition-all hover:-translate-y-2"
                  style={{ background: 'var(--color-surface)', boxShadow: 'var(--shadow-md)', border: '1px solid var(--color-border-light)' }}
                >
                  <span
                    className="text-5xl font-black opacity-10 absolute top-4 right-4"
                    style={{ fontFamily: 'var(--font-outfit)', color: 'var(--color-primary)' }}
                  >
                    {item.step}
                  </span>
                  <div
                    className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4"
                    style={{ background: 'var(--color-primary-50)' }}
                  >
                    <item.icon className="h-6 w-6" style={{ color: 'var(--color-primary)' }} />
                  </div>
                  <h3 className="text-lg font-bold mb-2" style={{ fontFamily: 'var(--font-outfit)' }}>
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div
            className="relative overflow-hidden rounded-3xl gradient-primary p-12 md:p-20 text-center"
            style={{ boxShadow: 'var(--shadow-xl)' }}
          >
            <div
              className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-20 blur-3xl"
              style={{ background: 'var(--color-accent)' }}
            />
            <div className="relative z-10">
              <h2
                className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6"
                style={{ fontFamily: 'var(--font-outfit)' }}
              >
                Ready to Get Started?
              </h2>
              <p className="text-lg text-white/80 max-w-2xl mx-auto mb-10">
                Join thousands of customers and artisans already using Handy Pro.
                Your next trusted professional is just a tap away.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-lg font-semibold transition-all hover:scale-105"
                  style={{ background: 'white', color: 'var(--color-primary-dark)' }}
                >
                  Find an Artisan
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  href="/register/artisan"
                  className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-lg font-semibold text-white transition-all hover:scale-105"
                  style={{ border: '2px solid rgba(255,255,255,0.3)' }}
                >
                  Become a Pro
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: 'var(--color-surface)', borderTop: '1px solid var(--color-border)' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
                <span className="text-white font-bold text-sm">H</span>
              </div>
              <span className="text-lg font-bold" style={{ fontFamily: 'var(--font-outfit)' }}>
                Handy<span className="text-gradient">Pro</span>
              </span>
            </div>
            <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
              © {new Date().getFullYear()} Handy Pro. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
