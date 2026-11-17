import { createClient } from '@/lib/supabase/client';
import { findNearbyArtisans } from '@/features/artisans/services/artisan-service';
import type { SearchFilters } from '../types';

const supabase = createClient();

export async function searchArtisans(filters: SearchFilters) {
  if (!filters.latitude || !filters.longitude) {
    throw new Error('Location is required for search');
  }

  return findNearbyArtisans(
    filters.latitude,
    filters.longitude,
    filters.radiusKm ?? 10,
    filters.category
  );
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
