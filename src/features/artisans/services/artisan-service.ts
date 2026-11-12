import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

export async function findNearbyArtisans(
  lat: number,
  lng: number,
  radiusKm: number = 10,
  categorySlug?: string
) {
  return supabase.rpc('find_nearby_artisans', {
    user_lat: lat,
    user_lng: lng,
    radius_km: radiusKm,
    category_slug: categorySlug,
  });
}

export async function getArtisanProfile(userId: string) {
  return supabase
    .from('artisan_profiles')
    .select('*, profiles(*), artisan_skills(*, skills(*, categories(*)))')
    .eq('user_id', userId)
    .single();
}
