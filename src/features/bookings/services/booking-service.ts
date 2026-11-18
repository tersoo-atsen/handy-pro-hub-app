import type { Database } from '@/types/database.types';

type BookingStatus = Database['public']['Enums']['booking_status'];

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:5000').trim();

export async function getMyBookings(userId: string): Promise<{
  data: any[] | null;
  error: Error | null;
}> {
  try {
    const response = await fetch(`${API_BASE}/bookings/me/${encodeURIComponent(userId)}`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return { data: null, error: new Error(err.message ?? 'Failed to fetch bookings') };
    }

    const data = await response.json();
    return { data, error: null };
  } catch (err: any) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Failed to fetch bookings'),
    };
  }
}

export async function getBookingById(bookingId: string): Promise<{
  data: any | null;
  error: Error | null;
}> {
  try {
    const response = await fetch(`${API_BASE}/bookings/${encodeURIComponent(bookingId)}`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return { data: null, error: new Error(err.message ?? 'Failed to fetch booking') };
    }

    const data = await response.json();
    return { data, error: null };
  } catch (err: any) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Failed to fetch booking'),
    };
  }
}

export async function updateBookingStatus(
  bookingId: string,
  status: BookingStatus,
  extras?: {
    cancellation_reason?: string;
    cancelled_by?: string;
    customer_notes?: string;
    artisan_notes?: string;
  }
): Promise<{
  data: any | null;
  error: Error | null;
}> {
  try {
    const response = await fetch(
      `${API_BASE}/bookings/${encodeURIComponent(bookingId)}/status`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status, ...(extras ?? {}) }),
      }
    );

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return { data: null, error: new Error(err.message ?? 'Failed to update booking status') };
    }

    const data = await response.json();
    return { data, error: null };
  } catch (err: any) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Failed to update booking status'),
    };
  }
}
