'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Send, Loader2 } from 'lucide-react';
import { useUser } from '@/hooks/use-user';
import { useGeolocation } from '@/hooks/use-geolocation';
import { getAllCategories } from '@/features/search/services/search-service';
import { createJob } from '@/features/jobs/services/job-service';

const defaultCategories = [
  { id: 'plumbing', name: 'Plumbing' },
  { id: 'electrical', name: 'Electrical' },
  { id: 'carpentry', name: 'Carpentry' },
  { id: 'painting', name: 'Painting' },
  { id: 'cleaning', name: 'Cleaning' },
  { id: 'ac-refrigeration', name: 'AC & Refrigeration' },
  { id: 'tiling', name: 'Tiling' },
  { id: 'welding', name: 'Welding' },
  { id: 'generator-repair', name: 'Generator Repair' },
  { id: 'landscaping', name: 'Landscaping' },
];

export default function NewJobPage() {
  const router = useRouter();
  const { profile } = useUser();
  const { latitude, longitude } = useGeolocation();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState(defaultCategories);

  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState<'low' | 'normal' | 'urgent' | 'emergency'>('normal');
  const [budgetMin, setBudgetMin] = useState('');
  const [budgetMax, setBudgetMax] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    getAllCategories().then(({ data }) => {
      if (Array.isArray(data) && data.length > 0) {
        setCategories(data.map((c) => ({ id: c.id, name: c.name })));
      }
    });
  }, []);

  const inputStyle = {
    background: 'var(--color-bg-secondary)',
    border: '1px solid var(--color-border)',
    color: 'var(--color-text)',
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.id) {
      setError('You must be signed in to post a job.');
      return;
    }

    setIsLoading(true);
    setError(null);

    const { error: createErr } = await createJob({
      customer_id: profile.id,
      category_id: categoryId,
      title,
      description,
      urgency,
      budget_min: budgetMin ? Number(budgetMin) : undefined,
      budget_max: budgetMax ? Number(budgetMax) : undefined,
      address,
      latitude: latitude ?? 6.5244,
      longitude: longitude ?? 3.3792,
    });

    if (createErr) {
      setError(createErr.message);
      setIsLoading(false);
      return;
    }

    router.push('/customer/jobs');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div>
        <Link href="/customer/jobs" className="inline-flex items-center gap-2 text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>
          <ArrowLeft className="h-4 w-4" /> Back to Jobs
        </Link>
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-outfit)' }}>Post a New Job</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>Describe what you need and get bids from artisans</p>
      </div>

      {error && (
        <div className="rounded-md p-4 text-sm" style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444' }}>
          {error}
        </div>
      )}

      <form
        className="space-y-5 rounded-md p-6"
        style={{ background: 'var(--color-surface)', boxShadow: 'var(--shadow-md)', border: '1px solid var(--color-border-light)' }}
        onSubmit={handleSubmit}
      >
        <div>
          <label className="block text-sm font-medium mb-2">Job Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Fix leaking kitchen pipe"
            required
            className="w-full rounded-md px-4 py-3 text-sm outline-none"
            style={inputStyle}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Category</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
            className="w-full rounded-md px-4 py-3 text-sm outline-none appearance-none"
            style={inputStyle}
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the job in detail..."
            required
            className="w-full rounded-md px-4 py-3 text-sm outline-none resize-none"
            style={inputStyle}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Urgency</label>
          <div className="grid grid-cols-4 gap-2">
            {(['low', 'normal', 'urgent', 'emergency'] as const).map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setUrgency(level)}
                className="rounded-md px-3 py-2 text-sm font-medium capitalize transition-all"
                style={{
                  background: urgency === level ? 'var(--color-primary-50)' : 'var(--color-bg-secondary)',
                  border: `1px solid ${urgency === level ? 'var(--color-primary)' : 'var(--color-border)'}`,
                  color: urgency === level ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                }}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Min Budget (₦)</label>
            <input
              type="number"
              value={budgetMin}
              onChange={(e) => setBudgetMin(e.target.value)}
              placeholder="5,000"
              className="w-full rounded-md px-4 py-3 text-sm outline-none"
              style={inputStyle}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Max Budget (₦)</label>
            <input
              type="number"
              value={budgetMax}
              onChange={(e) => setBudgetMax(e.target.value)}
              placeholder="50,000"
              className="w-full rounded-md px-4 py-3 text-sm outline-none"
              style={inputStyle}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter your address"
            required
            className="w-full rounded-md px-4 py-3 text-sm outline-none"
            style={inputStyle}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 rounded-md py-3 text-sm font-semibold text-white gradient-primary hover:scale-[1.02] transition-all disabled:opacity-60"
          style={{ boxShadow: 'var(--shadow-md)' }}
        >
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Send className="h-4 w-4" /> Post Job Request</>}
        </button>
      </form>
    </div>
  );
}
