export interface Bid {
  id: string;
  job_id: string;
  artisan_id: string;
  amount: number;
  message: string | null;
  estimated_hours: number | null;
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn' | 'expired';
  expires_at: string;
  created_at: string;
  updated_at: string;
  // Joined
  artisan_name?: string;
  artisan_avatar?: string;
  artisan_rating?: number;
}

export interface CreateBidInput {
  job_id: string;
  artisan_id: string;
  amount: number;
  message: string;
  estimated_hours?: number;
}
