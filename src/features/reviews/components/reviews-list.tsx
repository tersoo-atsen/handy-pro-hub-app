'use client';

import { Star } from 'lucide-react';
import type { Review } from '../types';

interface ReviewsListProps {
  reviews: Array<Review & { job_title?: string | null }>;
  emptyText?: string;
  reviewerFallbackLabel?: string;
}

export function ReviewsList({
  reviews,
  emptyText = 'No reviews yet. Completed bookings can be reviewed.',
  reviewerFallbackLabel = 'User',
}: ReviewsListProps) {
  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + Number(r.rating ?? 0), 0) / reviews.length
      : 0;

  return (
    <div
      className="rounded-md p-6 space-y-4"
      style={{
        background: 'var(--color-surface)',
        boxShadow: 'var(--shadow-sm)',
        border: '1px solid var(--color-border-light)',
      }}
    >
      <div className="flex items-center justify-between">
        <h3 className="font-semibold" style={{ fontFamily: 'var(--font-outfit)' }}>
          Reviews
        </h3>
        <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
          {avgRating.toFixed(1)} ★ ({reviews.length})
        </span>
      </div>

      {reviews.length === 0 ? (
        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          {emptyText}
        </p>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="rounded-md p-4 space-y-1.5"
              style={{
                background: 'var(--color-bg-secondary)',
                border: '1px solid var(--color-border-light)',
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">
                  {review.reviewer_name ?? reviewerFallbackLabel}
                </span>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="h-3.5 w-3.5"
                      style={{
                        color: star <= review.rating ? '#F59E0B' : 'var(--color-text-tertiary)',
                        fill: star <= review.rating ? '#F59E0B' : 'none',
                      }}
                    />
                  ))}
                </div>
              </div>
              {review.job_title && (
                <p className="text-xs" style={{ color: 'var(--color-primary)' }}>
                  {review.job_title}
                </p>
              )}
              {review.comment && (
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  {review.comment}
                </p>
              )}
              {review.created_at && (
                <p className="text-[11px]" style={{ color: 'var(--color-text-tertiary)' }}>
                  {new Date(review.created_at).toLocaleDateString()}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
