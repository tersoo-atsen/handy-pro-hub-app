import type { AppNotification } from '../types';

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:5000').trim();

export async function getNotifications(userId: string): Promise<{
  data: AppNotification[] | null;
  error: Error | null;
}> {
  try {
    const response = await fetch(`${API_BASE}/notifications/me/${encodeURIComponent(userId)}`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return { data: null, error: new Error(err.message ?? 'Failed to fetch notifications') };
    }

    const data = await response.json();
    return { data, error: null };
  } catch (err: any) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Failed to fetch notifications'),
    };
  }
}

export async function markAsRead(notificationId: string): Promise<{
  data: AppNotification | null;
  error: Error | null;
}> {
  try {
    const response = await fetch(
      `${API_BASE}/notifications/${encodeURIComponent(notificationId)}/read`,
      {
        method: 'PATCH',
        credentials: 'include',
      }
    );

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return { data: null, error: new Error(err.message ?? 'Failed to mark notification as read') };
    }

    const data = await response.json();
    return { data, error: null };
  } catch (err: any) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Failed to mark notification as read'),
    };
  }
}

export async function markAllAsRead(userId: string): Promise<{
  data: any | null;
  error: Error | null;
}> {
  try {
    const response = await fetch(
      `${API_BASE}/notifications/me/${encodeURIComponent(userId)}/read-all`,
      {
        method: 'PATCH',
        credentials: 'include',
      }
    );

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return { data: null, error: new Error(err.message ?? 'Failed to mark all notifications as read') };
    }

    const data = await response.json();
    return { data, error: null };
  } catch (err: any) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Failed to mark all notifications as read'),
    };
  }
}

export function subscribeToNotifications(
  userId: string,
  onNotification: (notification: AppNotification) => void
): () => void {
  if (typeof window === 'undefined' || typeof EventSource === 'undefined') {
    return () => {};
  }

  const eventSource = new EventSource(
    `${API_BASE}/notifications/stream/${encodeURIComponent(userId)}`,
    { withCredentials: true }
  );

  eventSource.onmessage = (event) => {
    try {
      const parsed = JSON.parse(event.data);
      if (parsed?.id) {
        onNotification(parsed);
      }
    } catch {
      // ignore malformed payloads
    }
  };

  return () => {
    eventSource.close();
  };
}
