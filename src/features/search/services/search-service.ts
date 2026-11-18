import { findNearbyArtisans } from '@/features/artisans/services/artisan-service';
import type { CategoryItem, SearchFilters, SearchResult } from '../types';

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:5000').trim();

export async function searchArtisans(filters: SearchFilters): Promise<{
  data: SearchResult[] | null;
  error: Error | null;
}> {
  const { data, error } = await findNearbyArtisans(
    filters.latitude,
    filters.longitude,
    filters.radiusKm ?? 10,
    filters.category
  );

  if (error || !Array.isArray(data)) {
    return { data: null, error };
  }

  let results: SearchResult[] = data;

  if (filters.query?.trim()) {
    const q = filters.query.trim().toLowerCase();
    results = results.filter(
      (a) =>
        a.full_name?.toLowerCase().includes(q) ||
        a.bio?.toLowerCase().includes(q) ||
        a.skills?.some(
          (s) =>
            s.skill_name?.toLowerCase().includes(q) ||
            s.category?.toLowerCase().includes(q)
        )
    );
  }

  if (filters.minRating !== undefined) {
    results = results.filter((a) => Number(a.rating_avg ?? 0) >= filters.minRating!);
  }

  if (filters.maxRate !== undefined) {
    results = results.filter(
      (a) => a.hourly_rate != null && Number(a.hourly_rate) <= filters.maxRate!
    );
  }

  if (filters.sortBy === 'rating') {
    results = [...results].sort((a, b) => Number(b.rating_avg ?? 0) - Number(a.rating_avg ?? 0));
  } else if (filters.sortBy === 'price') {
    results = [...results].sort(
      (a, b) => Number(a.hourly_rate ?? Infinity) - Number(b.hourly_rate ?? Infinity)
    );
  } else {
    results = [...results].sort(
      (a, b) => Number(a.distance_km ?? Infinity) - Number(b.distance_km ?? Infinity)
    );
  }

  return { data: results, error: null };
}

export async function searchCategories(query: string): Promise<{
  data: CategoryItem[] | null;
  error: Error | null;
}> {
  try {
    const params = new URLSearchParams({ q: query });
    const response = await fetch(`${API_BASE}/categories/search?${params.toString()}`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return { data: null, error: new Error(err.message ?? 'Failed to search categories') };
    }

    const data = await response.json();
    return { data, error: null };
  } catch (err: any) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Failed to search categories'),
    };
  }
}

export async function getAllCategories(): Promise<{
  data: CategoryItem[] | null;
  error: Error | null;
}> {
  try {
    const response = await fetch(`${API_BASE}/categories`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return { data: null, error: new Error(err.message ?? 'Failed to fetch categories') };
    }

    const data = await response.json();
    return { data, error: null };
  } catch (err: any) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Failed to fetch categories'),
    };
  }
}
