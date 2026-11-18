import type { Bid, CreateBidInput } from '../types';

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:5000').trim();

export async function getBidsForJob(jobId: string): Promise<{
  data: any[] | null;
  error: Error | null;
}> {
  try {
    const response = await fetch(`${API_BASE}/bids/job/${encodeURIComponent(jobId)}`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return { data: null, error: new Error(err.message ?? 'Failed to fetch bids for job') };
    }

    const data = await response.json();
    return { data, error: null };
  } catch (err: any) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Failed to fetch bids for job'),
    };
  }
}

export async function getMyBids(artisanOrUserId: string): Promise<{
  data: any[] | null;
  error: Error | null;
}> {
  try {
    const response = await fetch(`${API_BASE}/bids/me/${encodeURIComponent(artisanOrUserId)}`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return { data: null, error: new Error(err.message ?? 'Failed to fetch your bids') };
    }

    const data = await response.json();
    return { data, error: null };
  } catch (err: any) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Failed to fetch your bids'),
    };
  }
}

export async function createBid(input: CreateBidInput): Promise<{
  data: Bid | null;
  error: Error | null;
}> {
  try {
    const response = await fetch(`${API_BASE}/bids`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return { data: null, error: new Error(err.message ?? 'Failed to submit bid') };
    }

    const data = await response.json();
    return { data, error: null };
  } catch (err: any) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Failed to submit bid'),
    };
  }
}

export async function acceptBid(bidId: string, customerId: string): Promise<{
  data: { booking_id: string; booking: any } | null;
  error: Error | null;
}> {
  try {
    const response = await fetch(`${API_BASE}/bids/${encodeURIComponent(bidId)}/accept`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ customer_id: customerId }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return { data: null, error: new Error(err.message ?? 'Failed to accept bid') };
    }

    const data = await response.json();
    return { data, error: null };
  } catch (err: any) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Failed to accept bid'),
    };
  }
}

export async function withdrawBid(bidId: string): Promise<{
  data: Bid | null;
  error: Error | null;
}> {
  try {
    const response = await fetch(`${API_BASE}/bids/${encodeURIComponent(bidId)}/withdraw`, {
      method: 'PATCH',
      credentials: 'include',
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return { data: null, error: new Error(err.message ?? 'Failed to withdraw bid') };
    }

    const data = await response.json();
    return { data, error: null };
  } catch (err: any) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Failed to withdraw bid'),
    };
  }
}
