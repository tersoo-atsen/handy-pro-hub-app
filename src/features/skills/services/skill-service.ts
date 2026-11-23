const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:5000').trim();

export interface SkillItem {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  created_at?: string;
  categories?: {
    id: string;
    name: string;
    slug: string;
  };
}

export async function getSkills(filters?: {
  categoryId?: string;
  search?: string;
}): Promise<{
  data: SkillItem[] | null;
  error: Error | null;
}> {
  try {
    const params = new URLSearchParams();
    if (filters?.categoryId) {
      params.set('categoryId', filters.categoryId);
    }
    if (filters?.search) {
      params.set('search', filters.search);
    }
    const query = params.toString() ? `?${params.toString()}` : '';
    const response = await fetch(`${API_BASE}/skills${query}`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return { data: null, error: new Error(err.message ?? 'Failed to fetch skills') };
    }

    const data = await response.json();
    return { data, error: null };
  } catch (err: any) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Failed to fetch skills'),
    };
  }
}

export async function getSkillById(id: string): Promise<{
  data: SkillItem | null;
  error: Error | null;
}> {
  try {
    const response = await fetch(`${API_BASE}/skills/${encodeURIComponent(id)}`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return { data: null, error: new Error(err.message ?? 'Failed to fetch skill') };
    }

    const data = await response.json();
    return { data, error: null };
  } catch (err: any) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Failed to fetch skill'),
    };
  }
}
