export interface ArtisanProfile {
  artisan_id: string;
  user_id: string;
  full_name: string;
  avatar_url: string | null;
  bio: string | null;
  rating_avg: number;
  rating_count: number;
  hourly_rate: number | null;
  distance_km: number;
  skills: ArtisanSkill[];
}

export interface ArtisanSkill {
  skill_id: string;
  skill_name: string;
  category: string;
  proficiency: number;
}
