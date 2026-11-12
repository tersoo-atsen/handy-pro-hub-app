import { createClient } from '@/lib/supabase/client';
import type { SearchFilters } from '../types';

const supabase = createClient();

export async function searchArtisans(filters: SearchFilters) {
  if (!filters.latitude || !filters.longitude) {
    throw new Error('Location is required for search');
  }

  return supabase.rpc('find_nearby_artisans', {
    user_lat: filters.latitude,
    user_lng: filters.longitude,
    radius_km: filters.radiusKm ?? 10,
    category_slug: filters.category,
  });
}

export async function searchCategories(query: string) {
  return supabase
    .from('categories')
    .select('*')
    .ilike('name', `%${query}%`)
    .eq('is_active', true);
}

export async function getAllCategories() {
  return supabase
    .from('categories')
    .select('*, skills(*)')
    .eq('is_active', true)
    .order('name');
}
