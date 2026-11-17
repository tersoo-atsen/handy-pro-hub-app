const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';

export async function findNearbyArtisans(
  lat: number,
  lng: number,
  radiusKm: number = 10,
  categorySlug?: string
) {
  const params = new URLSearchParams({
    lat: String(lat),
    lng: String(lng),
    radiusKm: String(radiusKm),
  });
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
}

export async function getArtisanProfile(userId: string) {
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
}

export async function updateArtisanProfile(
  userId: string,
  payload: {
    bio?: string;
    years_experience?: number;
    hourly_rate?: number;
    is_available?: boolean;
    service_radius_km?: number;
    skills?: Array<{ skill_id: string; proficiency?: number }>;
  }
) {
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
}

export async function upgradeToArtisan(userId: string) {
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
}

export async function getArtisanAvailability(userId: string) {
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
}

export async function updateArtisanAvailability(
  userId: string,
  schedule: Array<{ day_of_week: number; start_time: string; end_time: string }>
) {
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
}
