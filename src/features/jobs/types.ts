export interface JobRequest {
  id: string;
  customer_id: string;
  category_id: string;
  title: string;
  description: string;
  status: 'draft' | 'open' | 'bidding' | 'assigned' | 'in_progress' | 'completed' | 'cancelled' | 'disputed' | 'resolved';
  urgency: 'low' | 'normal' | 'urgent' | 'emergency';
  budget_min: number | null;
  budget_max: number | null;
  address: string;
  geohash: string;
  search_radius_km: number;
  scheduled_at: string | null;
  media_urls: string[];
  bid_count: number;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
  // Joined fields
  customer_name?: string;
  category_name?: string;
  distance_km?: number;
}

export interface CreateJobInput {
  customer_id: string;
  title: string;
  description: string;
  category_id: string;
  urgency: 'low' | 'normal' | 'urgent' | 'emergency';
  budget_min?: number;
  budget_max?: number;
  address: string;
  latitude: number;
  longitude: number;
  scheduled_at?: string;
}
