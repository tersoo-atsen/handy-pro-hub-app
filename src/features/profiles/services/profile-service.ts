const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';

export async function getProfiles(filters?: { role?: string; search?: string }) {
  const params = new URLSearchParams();
  if (filters?.role && filters.role !== 'all') {
    params.set('role', filters.role);
  }
  if (filters?.search) {
    params.set('search', filters.search);
  }
  const query = params.toString() ? `?${params.toString()}` : '';
  const response = await fetch(`${API_BASE}/profiles${query}`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    return { data: null, error: new Error(err.message ?? 'Failed to fetch profiles') };
  }

  const data = await response.json();
  return { data, error: null };
}

export async function getProfileById(id: string) {
  const response = await fetch(`${API_BASE}/profiles/${encodeURIComponent(id)}`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    return { data: null, error: new Error(err.message ?? 'Failed to fetch profile') };
  }

  const data = await response.json();
  return { data, error: null };
}

export async function updateProfile(
  id: string,
  payload: {
    full_name?: string;
    phone?: string;
    avatar_url?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
  }
) {
  const response = await fetch(`${API_BASE}/profiles/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    return { data: null, error: new Error(err.message ?? 'Failed to update profile') };
  }

  const data = await response.json();
  return { data, error: null };
}
