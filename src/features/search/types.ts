export interface SearchFilters {
  query?: string;
  category?: string;
  latitude?: number;
  longitude?: number;
  radiusKm?: number;
  minRating?: number;
  maxRate?: number;
  sortBy?: 'distance' | 'rating' | 'price';
}

export interface SearchResult {
  artisan_id: string;
  user_id: string;
  full_name: string;
  avatar_url: string | null;
  bio: string | null;
  rating_avg: number;
  rating_count: number;
  hourly_rate: number | null;
  distance_km: number;
  skills: Array<{
    skill_id: string;
    skill_name: string;
    category: string;
    proficiency: number;
  }>;
}
