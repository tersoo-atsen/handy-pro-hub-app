import type { CreateJobInput, JobRequest } from '../types';

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:5000').trim();

export async function getMyJobs(userId: string): Promise<{
  data: JobRequest[] | null;
  error: Error | null;
}> {
  try {
    const response = await fetch(`${API_BASE}/jobs/me/${encodeURIComponent(userId)}`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return { data: null, error: new Error(err.message ?? 'Failed to fetch jobs') };
    }

    const data = await response.json();
    return { data, error: null };
  } catch (err: any) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Failed to fetch jobs'),
    };
  }
}

export async function getJobById(jobId: string): Promise<{
  data: JobRequest | null;
  error: Error | null;
}> {
  try {
    const response = await fetch(`${API_BASE}/jobs/${encodeURIComponent(jobId)}`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return { data: null, error: new Error(err.message ?? 'Failed to fetch job') };
    }

    const data = await response.json();
    return { data, error: null };
  } catch (err: any) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Failed to fetch job'),
    };
  }
}

export async function createJob(input: CreateJobInput): Promise<{
  data: JobRequest | null;
  error: Error | null;
}> {
  try {
    const response = await fetch(`${API_BASE}/jobs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return { data: null, error: new Error(err.message ?? 'Failed to create job') };
    }

    const data = await response.json();
    return { data, error: null };
  } catch (err: any) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Failed to create job'),
    };
  }
}

export async function findNearbyJobs(
  lat?: number | null,
  lng?: number | null,
  radiusKm: number = 15,
  categorySlug?: string
): Promise<{
  data: JobRequest[] | null;
  error: Error | null;
}> {
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

    const response = await fetch(`${API_BASE}/jobs/nearby?${params.toString()}`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return { data: null, error: new Error(err.message ?? 'Failed to fetch nearby jobs') };
    }

    const data = await response.json();
    return { data, error: null };
  } catch (err: any) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Failed to fetch nearby jobs'),
    };
  }
}
