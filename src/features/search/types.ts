export interface SearchFilters {
  query?: string;
  category?: string;
  latitude?: number | null;
  longitude?: number | null;
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
  is_verified?: boolean;
  rating_avg: number;
  rating_count: number;
  hourly_rate: number | null;
  distance_km: number | null;
  skills: Array<{
    skill_id: string;
    skill_name: string;
    category: string;
    proficiency: number;
  }>;
}

export interface SkillItem {
  id: string;
  category_id: string;
  name: string;
  slug: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon_url: string | null;
  is_active: boolean;
  skills?: SkillItem[];
}
