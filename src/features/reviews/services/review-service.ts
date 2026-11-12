import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

export async function getReviewsForUser(userId: string) {
  return supabase
    .from('reviews')
    .select('*, profiles!reviewer_id(full_name, avatar_url)')
    .eq('reviewee_id', userId)
    .order('created_at', { ascending: false });
}

export async function createReview(data: {
  booking_id: string;
  reviewer_id: string;
  reviewee_id: string;
  rating: number;
  comment: string;
}) {
  return supabase.from('reviews').insert(data);
}
