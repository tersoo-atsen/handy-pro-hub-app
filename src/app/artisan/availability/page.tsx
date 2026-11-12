'use client';

import { Clock, Check } from 'lucide-react';

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function ArtisanAvailabilityPage() {
  return (
    <div className="max-w-2xl space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-outfit)' }}>Availability</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>Set your weekly working hours</p>
      </div>

      <div
        className="rounded-2xl p-6 space-y-4"
        style={{ background: 'var(--color-surface)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border-light)' }}
      >
        {days.map((day, i) => (
          <div
            key={day}
            className="flex items-center justify-between py-3"
            style={{ borderBottom: i < days.length - 1 ? '1px solid var(--color-border-light)' : 'none' }}
          >
            <div className="flex items-center gap-3">
              <button
                className="h-6 w-6 rounded-md flex items-center justify-center transition-all"
                style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
              >
                {(i >= 1 && i <= 5) && <Check className="h-4 w-4" style={{ color: 'var(--color-primary)' }} />}
              </button>
              <span className="text-sm font-medium">{day}</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="time"
                defaultValue="08:00"
                className="rounded-lg px-3 py-1.5 text-sm outline-none"
                style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
              />
              <span className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>to</span>
              <input
                type="time"
                defaultValue="17:00"
                className="rounded-lg px-3 py-1.5 text-sm outline-none"
                style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
              />
            </div>
          </div>
        ))}

        <button
          className="w-full rounded-xl py-3 text-sm font-semibold text-white gradient-primary hover:scale-[1.02] transition-all mt-4"
          style={{ boxShadow: 'var(--shadow-md)' }}
        >
          Save Schedule
        </button>
      </div>
    </div>
  );
}
