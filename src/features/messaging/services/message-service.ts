import type { Conversation, Message } from '../types';

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:5000').trim();

export async function getConversations(userId: string): Promise<{
  data: Conversation[] | null;
  error: Error | null;
}> {
  try {
    const response = await fetch(`${API_BASE}/conversations/me/${encodeURIComponent(userId)}`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return { data: null, error: new Error(err.message ?? 'Failed to fetch conversations') };
    }

    const data = await response.json();
    return { data, error: null };
  } catch (err: any) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Failed to fetch conversations'),
    };
  }
}

export async function getOrCreateConversation(input: {
  participant_1: string;
  participant_2: string;
  job_id?: string;
}): Promise<{
  data: Conversation | null;
  error: Error | null;
}> {
  try {
    const response = await fetch(`${API_BASE}/conversations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return { data: null, error: new Error(err.message ?? 'Failed to create conversation') };
    }

    const data = await response.json();
    return { data, error: null };
  } catch (err: any) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Failed to create conversation'),
    };
  }
}

export async function getMessages(conversationId: string): Promise<{
  data: Message[] | null;
  error: Error | null;
}> {
  try {
    const response = await fetch(
      `${API_BASE}/conversations/${encodeURIComponent(conversationId)}/messages`,
      {
        method: 'GET',
        credentials: 'include',
      }
    );

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return { data: null, error: new Error(err.message ?? 'Failed to fetch messages') };
    }

    const data = await response.json();
    return { data, error: null };
  } catch (err: any) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Failed to fetch messages'),
    };
  }
}

export async function sendMessage(
  conversationId: string,
  senderId: string,
  content: string
): Promise<{
  data: Message | null;
  error: Error | null;
}> {
  try {
    const response = await fetch(
      `${API_BASE}/conversations/${encodeURIComponent(conversationId)}/messages`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ sender_id: senderId, content }),
      }
    );

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return { data: null, error: new Error(err.message ?? 'Failed to send message') };
    }

    const data = await response.json();
    return { data, error: null };
  } catch (err: any) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Failed to send message'),
    };
  }
}

export function subscribeToMessages(
  userId: string,
  onEvent: (payload: { conversationId: string; message: Message }) => void
): () => void {
  if (typeof window === 'undefined' || typeof EventSource === 'undefined') {
    return () => {};
  }

  const eventSource = new EventSource(
    `${API_BASE}/conversations/stream/${encodeURIComponent(userId)}`,
    { withCredentials: true }
  );

  eventSource.onmessage = (event) => {
    try {
      const parsed = JSON.parse(event.data);
      if (parsed?.conversationId && parsed?.message) {
        onEvent(parsed);
      }
    } catch {
      // ignore malformed payloads
    }
  };

  return () => {
    eventSource.close();
  };
}

