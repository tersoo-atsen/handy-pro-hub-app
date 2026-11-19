'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@/hooks/use-user';
import { getReviewsForUser } from '@/features/reviews/services/review-service';
import { ReviewsList } from '@/features/reviews/components/reviews-list';
import { ProfileInformationCard } from '@/features/profiles/components/profile-information-card';
import type { Review } from '@/features/reviews/types';

export default function CustomerProfilePage() {
  const { profile, isLoading } = useUser();
  const [reviews, setReviews] = useState<Array<Review & { job_title?: string | null }>>([]);

  useEffect(() => {
    if (!profile?.id) return;
    getReviewsForUser(profile.id).then(({ data }) => {
      setReviews(data ?? []);
    });
  }, [profile?.id]);

  if (isLoading || !profile) {
    return <div className="max-w-6xl mx-auto">Loading profile...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 min-w-0">
          <ProfileInformationCard profile={profile} />
        </div>

        <div className="lg:col-span-5 min-w-0">
          <ReviewsList
            reviews={reviews}
            emptyText="No reviews yet. Completed bookings can be reviewed by artisans."
            reviewerFallbackLabel="Artisan"
          />
        </div>
      </div>
    </div>
  );
}
