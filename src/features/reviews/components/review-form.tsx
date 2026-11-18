'use client';

import { useState } from 'react';
import { Star, Loader2 } from 'lucide-react';
import { createReview } from '../services/review-service';
import type { Review } from '../types';

interface ReviewFormProps {
  bookingId: string;
  reviewerId: string;
  revieweeId: string;
  revieweeName: string;
  onSubmitted: (review: Review) => void;
  onCancel: () => void;
}

export function ReviewForm({
  bookingId,
  reviewerId,
  revieweeId,
  revieweeName,
  onSubmitted,
  onCancel,
}: ReviewFormProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const { data, error: submitErr } = await createReview({
      booking_id: bookingId,
      reviewer_id: reviewerId,
      reviewee_id: revieweeId,
      rating,
      comment: comment.trim() || undefined,
    });

    setSubmitting(false);

    if (submitErr || !data) {
      setError(submitErr?.message ?? 'Failed to submit review');
      return;
    }

    onSubmitted(data);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="pt-4 space-y-3"
      style={{ borderTop: '1px solid var(--color-border-light)' }}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold">Rate {revieweeName}</p>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              className="p-0.5 transition-transform hover:scale-110"
              aria-label={`Rate ${value} star${value > 1 ? 's' : ''}`}
            >
              <Star
                className="h-5 w-5"
                style={{
                  color: value <= rating ? '#F59E0B' : 'var(--color-text-tertiary)',
                  fill: value <= rating ? '#F59E0B' : 'none',
                }}
              />
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div
          className="rounded-md px-3 py-2 text-xs font-medium"
          style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444' }}
        >
          {error}
        </div>
      )}

      <textarea
        rows={2}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your experience..."
        className="w-full rounded-md px-3 py-2 text-sm outline-none resize-none"
        style={{
          background: 'var(--color-bg-secondary)',
          border: '1px solid var(--color-border)',
          color: 'var(--color-text)',
        }}
      />

      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md px-3 py-1.5 text-xs font-medium"
          style={{
            background: 'var(--color-bg-secondary)',
            color: 'var(--color-text-secondary)',
          }}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-1.5 rounded-md px-4 py-1.5 text-xs font-semibold text-white gradient-primary disabled:opacity-60"
        >
          {submitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : 'Submit Review'}
        </button>
      </div>
    </form>
  );
}
