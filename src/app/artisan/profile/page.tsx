'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@/hooks/use-user';
import { getArtisanProfile } from '@/features/artisans/services/artisan-service';
import { getReviewsForUser } from '@/features/reviews/services/review-service';
import { ReviewsList } from '@/features/reviews/components/reviews-list';
import {
  ProfileInformationCard,
  type ArtisanDetailsState,
} from '@/features/profiles/components/profile-information-card';
import type { Review } from '@/features/reviews/types';

export default function ArtisanProfilePage() {
  const { profile, isLoading } = useUser();

  const [artisanDetails, setArtisanDetails] = useState<ArtisanDetailsState>({
    bio: '',
    hourlyRate: '',
    yearsExperience: '',
    serviceRadiusKm: '10',
    categorySlug: '',
    categoryName: '',
    ratingAvg: 0,
    ratingCount: 0,
    verifiedAt: null,
  });
  const [reviews, setReviews] = useState<Array<Review & { job_title?: string | null }>>([]);

  useEffect(() => {
    if (!profile?.id) return;

    getArtisanProfile(profile.id).then(({ data }) => {
      if (data) {
        const firstSkill = data.artisan_skills?.[0];
        setArtisanDetails({
          bio: data.bio ?? '',
          hourlyRate: data.hourly_rate != null ? String(data.hourly_rate) : '',
          yearsExperience: data.years_experience != null ? String(data.years_experience) : '',
          serviceRadiusKm: data.service_radius_km != null ? String(data.service_radius_km) : '10',
          categorySlug: firstSkill?.skills?.categories?.slug ?? '',
          categoryName: firstSkill?.skills?.categories?.name ?? firstSkill?.skills?.name ?? '',
          ratingAvg: Number(data.rating_avg ?? 0),
          ratingCount: Number(data.rating_count ?? 0),
          verifiedAt: data.verified_at ?? null,
        });
      }
    });

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
          <ProfileInformationCard
            profile={profile}
            isArtisan
            artisanDetails={artisanDetails}
            onArtisanDetailsUpdated={setArtisanDetails}
          />
        </div>

        <div className="lg:col-span-5 min-w-0">
          <ReviewsList
            reviews={reviews}
            emptyText="No reviews yet. Completed bookings can be reviewed by customers."
            reviewerFallbackLabel="Customer"
          />
        </div>
      </div>
    </div>
  );
}
