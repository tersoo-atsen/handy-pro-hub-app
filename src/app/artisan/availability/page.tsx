'use client';

import { useEffect, useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { useUser } from '@/hooks/use-user';
import {
  getArtisanAvailability,
  updateArtisanAvailability,
} from '@/features/artisans/services/artisan-service';

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

interface DaySchedule {
  enabled: boolean;
  start_time: string;
  end_time: string;
}

function formatTimeInput(val: string | undefined, fallback: string): string {
  if (!val) return fallback;
  // Handle ISO strings like "1970-01-01T08:00:00.000Z" or "08:00:00"
  const match = val.match(/(\d{2}:\d{2})/);
  return match ? match[1] : fallback;
}

export default function ArtisanAvailabilityPage() {
  const { profile, isLoading } = useUser();
  const [saving, setSaving] = useState(false);
  const [schedule, setSchedule] = useState<DaySchedule[]>(
    days.map((_, i) => ({
      enabled: i >= 1 && i <= 5,
      start_time: '08:00',
      end_time: '17:00',
    }))
  );

  useEffect(() => {
    if (!profile?.id) return;
    getArtisanAvailability(profile.id).then(({ data }) => {
      if (Array.isArray(data) && data.length > 0) {
        const byDay = new Map<number, { start_time: string; end_time: string }>();
        for (const slot of data) {
          byDay.set(Number(slot.day_of_week), {
            start_time: formatTimeInput(slot.start_time, '08:00'),
            end_time: formatTimeInput(slot.end_time, '17:00'),
          });
        }
        setSchedule(
          days.map((_, i) => {
            const slot = byDay.get(i);
            return {
              enabled: Boolean(slot),
              start_time: slot?.start_time ?? '08:00',
              end_time: slot?.end_time ?? '17:00',
            };
          })
        );
      }
    });
  }, [profile?.id]);

  const toggleDay = (index: number) => {
    setSchedule((prev) =>
      prev.map((item, i) => (i === index ? { ...item, enabled: !item.enabled } : item))
    );
  };

  const updateTime = (index: number, field: 'start_time' | 'end_time', value: string) => {
    setSchedule((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const handleSave = async () => {
    if (!profile?.id) return;
    setSaving(true);
    const activeSlots = schedule
      .map((item, day_of_week) => ({
        day_of_week,
        start_time: item.start_time,
        end_time: item.end_time,
        enabled: item.enabled,
      }))
      .filter((item) => item.enabled)
      .map(({ day_of_week, start_time, end_time }) => ({
        day_of_week,
        start_time,
        end_time,
      }));

    await updateArtisanAvailability(profile.id, activeSlots);
    setSaving(false);
  };

  if (isLoading) {
    return <div>Loading availability...</div>;
  }

  return (
    <div className="max-w-2xl space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-outfit)' }}>Availability</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>Set your weekly working hours</p>
      </div>

      <div
        className="rounded-md p-6 space-y-4"
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
                type="button"
                onClick={() => toggleDay(i)}
                className="h-6 w-6 rounded-md flex items-center justify-center transition-all"
                style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
              >
                {schedule[i]?.enabled && <Check className="h-4 w-4" style={{ color: 'var(--color-primary)' }} />}
              </button>
              <span className="text-sm font-medium">{day}</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="time"
                disabled={!schedule[i]?.enabled}
                value={schedule[i]?.start_time ?? '08:00'}
                onChange={(e) => updateTime(i, 'start_time', e.target.value)}
                className="rounded-md px-3 py-1.5 text-sm outline-none disabled:opacity-50"
                style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
              />
              <span className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>to</span>
              <input
                type="time"
                disabled={!schedule[i]?.enabled}
                value={schedule[i]?.end_time ?? '17:00'}
                onChange={(e) => updateTime(i, 'end_time', e.target.value)}
                className="rounded-md px-3 py-1.5 text-sm outline-none disabled:opacity-50"
                style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
              />
            </div>
          </div>
        ))}

        <button
          type="button"
          disabled={saving}
          onClick={handleSave}
          className="w-full flex items-center justify-center gap-2 rounded-md py-3 text-sm font-semibold text-white gradient-primary hover:scale-[1.02] transition-all mt-4 disabled:opacity-60"
          style={{ boxShadow: 'var(--shadow-md)' }}
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Saving...
            </>
          ) : (
            'Save Schedule'
          )}
        </button>
      </div>
    </div>
  );
}
