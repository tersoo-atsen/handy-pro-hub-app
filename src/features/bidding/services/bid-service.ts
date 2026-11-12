import { createClient } from '@/lib/supabase/client';
import type { CreateBidInput } from '../types';

const supabase = createClient();

export async function getBidsForJob(jobId: string) {
  return supabase
    .from('bids')
    .select('*, artisan_profiles(id, rating_avg, rating_count, profiles(full_name, avatar_url))')
    .eq('job_id', jobId)
    .order('created_at', { ascending: false });
}

export async function createBid(input: CreateBidInput) {
  return supabase.from('bids').insert(input).select().single();
}

export async function acceptBid(bidId: string, customerId: string) {
  return supabase.rpc('accept_bid', {
    p_bid_id: bidId,
    p_customer_id: customerId,
  });
}

export async function withdrawBid(bidId: string) {
  return supabase
    .from('bids')
    .update({ status: 'withdrawn' })
    .eq('id', bidId);
}
