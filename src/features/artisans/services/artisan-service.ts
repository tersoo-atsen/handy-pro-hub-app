const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:5000').trim();

export async function findNearbyArtisans(
  lat?: number | null,
  lng?: number | null,
  radiusKm: number = 10,
  categorySlug?: string
) {
  try {
    const params = new URLSearchParams({
      radiusKm: String(radiusKm),
    });
    if (lat !== undefined && lat !== null) {
      params.set('lat', String(lat));
    }
    if (lng !== undefined && lng !== null) {
      params.set('lng', String(lng));
    }
    if (categorySlug) {
      params.set('categorySlug', categorySlug);
    }

    const response = await fetch(`${API_BASE}/artisans/nearby?${params.toString()}`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return { data: null, error: new Error(err.message ?? 'Failed to fetch nearby artisans') };
    }

    const data = await response.json();
    return { data, error: null };
  } catch (err: any) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Failed to fetch nearby artisans'),
    };
  }
}

export async function getArtisanProfile(userId: string) {
  try {
    const response = await fetch(`${API_BASE}/artisans/${encodeURIComponent(userId)}`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return { data: null, error: new Error(err.message ?? 'Failed to fetch artisan profile') };
    }

    const data = await response.json();
    return { data, error: null };
  } catch (err: any) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Failed to fetch artisan profile'),
    };
  }
}

export async function updateArtisanProfile(
  userId: string,
  payload: {
    bio?: string;
    years_experience?: number;
    hourly_rate?: number;
    is_available?: boolean;
    service_radius_km?: number;
    category_slug?: string;
    skills?: Array<{ skill_id: string; proficiency?: number }>;
  }
) {
  try {
    const response = await fetch(`${API_BASE}/artisans/${encodeURIComponent(userId)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return { data: null, error: new Error(err.message ?? 'Failed to update artisan profile') };
    }

    const data = await response.json();
    return { data, error: null };
  } catch (err: any) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Failed to update artisan profile'),
    };
  }
}

export async function upgradeToArtisan(userId: string) {
  try {
    const response = await fetch(`${API_BASE}/artisans/${encodeURIComponent(userId)}/upgrade`, {
      method: 'POST',
      credentials: 'include',
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return { data: null, error: new Error(err.message ?? 'Failed to upgrade to artisan') };
    }

    const data = await response.json();
    return { data, error: null };
  } catch (err: any) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Failed to upgrade to artisan'),
    };
  }
}

export async function getArtisanAvailability(userId: string) {
  try {
    const response = await fetch(
      `${API_BASE}/artisans/${encodeURIComponent(userId)}/availability`,
      {
        method: 'GET',
        credentials: 'include',
      }
    );

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return { data: null, error: new Error(err.message ?? 'Failed to fetch availability') };
    }

    const data = await response.json();
    return { data, error: null };
  } catch (err: any) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Failed to fetch availability'),
    };
  }
}

export async function updateArtisanAvailability(
  userId: string,
  schedule: Array<{ day_of_week: number; start_time: string; end_time: string }>
) {
  try {
    const response = await fetch(
      `${API_BASE}/artisans/${encodeURIComponent(userId)}/availability`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ schedule }),
      }
    );

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return { data: null, error: new Error(err.message ?? 'Failed to update availability') };
    }

    const data = await response.json();
    return { data, error: null };
  } catch (err: any) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Failed to update availability'),
    };
  }
}

export async function addArtisanPortfolioItem(
  userId: string,
  payload: { title: string; description?: string; image_url: string }
) {
  try {
    const response = await fetch(
      `${API_BASE}/artisans/${encodeURIComponent(userId)}/portfolio`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return { data: null, error: new Error(err.message ?? 'Failed to add portfolio item') };
    }

    const data = await response.json();
    return { data, error: null };
  } catch (err: any) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Failed to add portfolio item'),
    };
  }
}

export async function updateArtisanPortfolioItem(
  userId: string,
  itemId: string,
  payload: { title?: string; description?: string; image_url?: string }
) {
  try {
    const response = await fetch(
      `${API_BASE}/artisans/${encodeURIComponent(userId)}/portfolio/${encodeURIComponent(itemId)}`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return { data: null, error: new Error(err.message ?? 'Failed to update portfolio item') };
    }

    const data = await response.json();
    return { data, error: null };
  } catch (err: any) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Failed to update portfolio item'),
    };
  }
}

export async function deleteArtisanPortfolioItem(userId: string, itemId: string) {
  try {
    const response = await fetch(
      `${API_BASE}/artisans/${encodeURIComponent(userId)}/portfolio/${encodeURIComponent(itemId)}`,
      {
        method: 'DELETE',
        credentials: 'include',
      }
    );

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return { data: null, error: new Error(err.message ?? 'Failed to delete portfolio item') };
    }

    const data = await response.json();
    return { data, error: null };
  } catch (err: any) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Failed to delete portfolio item'),
    };
  }
}

export async function upsertArtisanSkill(
  userId: string,
  payload: { skill_id: string; proficiency?: number }
) {
  try {
    const response = await fetch(
      `${API_BASE}/artisans/${encodeURIComponent(userId)}/skills`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return { data: null, error: new Error(err.message ?? 'Failed to save artisan skill') };
    }

    const data = await response.json();
    return { data, error: null };
  } catch (err: any) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Failed to save artisan skill'),
    };
  }
}

export async function removeArtisanSkill(userId: string, skillId: string) {
  try {
    const response = await fetch(
      `${API_BASE}/artisans/${encodeURIComponent(userId)}/skills/${encodeURIComponent(skillId)}`,
      {
        method: 'DELETE',
        credentials: 'include',
      }
    );

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return { data: null, error: new Error(err.message ?? 'Failed to remove artisan skill') };
    }

    const data = await response.json();
    return { data, error: null };
  } catch (err: any) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Failed to remove artisan skill'),
    };
  }
}
