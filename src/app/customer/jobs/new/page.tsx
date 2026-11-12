'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Send, Loader2 } from 'lucide-react';

const categories = [
  { id: '1', name: 'Plumbing' },
  { id: '2', name: 'Electrical' },
  { id: '3', name: 'Carpentry' },
  { id: '4', name: 'Painting' },
  { id: '5', name: 'Cleaning' },
  { id: '6', name: 'AC & Refrigeration' },
  { id: '7', name: 'Tiling' },
  { id: '8', name: 'Welding' },
  { id: '9', name: 'Generator Repair' },
  { id: '10', name: 'Landscaping' },
];

export default function NewJobPage() {
  const [isLoading, setIsLoading] = useState(false);

  const inputStyle = {
    background: 'var(--color-bg-secondary)',
    border: '1px solid var(--color-border)',
    color: 'var(--color-text)',
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

      <form
        className="space-y-5 rounded-2xl p-6"
        style={{ background: 'var(--color-surface)', boxShadow: 'var(--shadow-md)', border: '1px solid var(--color-border-light)' }}
        onSubmit={(e) => { e.preventDefault(); setIsLoading(true); }}
      >
        <div>
          <label className="block text-sm font-medium mb-2">Job Title</label>
          <input type="text" placeholder="e.g. Fix leaking kitchen pipe" required className="w-full rounded-xl px-4 py-3 text-sm outline-none" style={inputStyle} />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Category</label>
          <select required className="w-full rounded-xl px-4 py-3 text-sm outline-none appearance-none" style={inputStyle}>
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea rows={4} placeholder="Describe the job in detail..." required className="w-full rounded-xl px-4 py-3 text-sm outline-none resize-none" style={inputStyle} />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Urgency</label>
          <div className="grid grid-cols-4 gap-2">
            {['Low', 'Normal', 'Urgent', 'Emergency'].map((level) => (
              <button key={level} type="button" className="rounded-xl px-3 py-2 text-sm font-medium transition-all" style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', color: 'var(--color-text-secondary)' }}>
                {level}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Min Budget (₦)</label>
            <input type="number" placeholder="5,000" className="w-full rounded-xl px-4 py-3 text-sm outline-none" style={inputStyle} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Max Budget (₦)</label>
            <input type="number" placeholder="50,000" className="w-full rounded-xl px-4 py-3 text-sm outline-none" style={inputStyle} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Address</label>
          <input type="text" placeholder="Enter your address" required className="w-full rounded-xl px-4 py-3 text-sm outline-none" style={inputStyle} />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white gradient-primary hover:scale-[1.02] transition-all disabled:opacity-60"
          style={{ boxShadow: 'var(--shadow-md)' }}
        >
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Send className="h-4 w-4" /> Post Job Request</>}
        </button>
      </form>
    </div>
  );
}
