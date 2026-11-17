// Updated auth service to use the custom API instead of Supabase for login/registration.
import type { LoginCredentials, RegisterData } from '../types';

// Base URL for the backend API – configure via environment variable.
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';

function persistAuthSession(data: { access_token?: string; user?: any }) {
  if (typeof window === 'undefined') return;
  if (data.access_token) {
    window.localStorage.setItem('access_token', data.access_token);
    document.cookie = `access_token=${encodeURIComponent(data.access_token)}; path=/; max-age=604800; SameSite=Lax`;
  }
  if (data.user) {
    const serialized = JSON.stringify(data.user);
    window.localStorage.setItem('handy_user', serialized);
    document.cookie = `handy_user=${encodeURIComponent(serialized)}; path=/; max-age=604800; SameSite=Lax`;
  }
  window.dispatchEvent(new Event('handy-auth-change'));
}

function clearAuthSession() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem('access_token');
  window.localStorage.removeItem('handy_user');
  document.cookie = 'access_token=; path=/; max-age=0; SameSite=Lax';
  document.cookie = 'handy_user=; path=/; max-age=0; SameSite=Lax';
  window.dispatchEvent(new Event('handy-auth-change'));
}

/**
 * Sign in using the backend `/auth/login` endpoint.
 * Returns the JSON response containing access_token and user data.
 */
export async function signIn({ email, password }: LoginCredentials) {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
    credentials: 'include',
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message ?? 'Login failed');
  }
  const result = await response.json();
  persistAuthSession(result);
  return result;
}

/**
 * Register a new user via `/auth/signup/customer` or `/auth/signup/artisan`.
 * The `role` field determines which endpoint to hit.
 */
export async function signUp(data: RegisterData) {
  const endpoint = data.role === 'artisan' ? '/auth/signup/artisan' : '/auth/signup/customer';
  const nameParts = (data.full_name ?? '').trim().split(/\s+/);
  const firstName = nameParts[0] || 'User';
  const lastName = nameParts.slice(1).join(' ') || firstName;

  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      firstName,
      lastName,
      email: data.email,
      password: data.password,
    }),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message ?? 'Sign‑up failed');
  }
  const result = await response.json();
  if (result?.user) {
    persistAuthSession({
      user: {
        id: result.user.id,
        email: result.user.email,
        role: result.user.role,
      },
    });
  }
  return result;
}

/**
 * Sign out via the backend `/auth/logout` endpoint.
 */
export async function signOut() {
  try {
    const response = await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message ?? 'Logout failed');
    }
    return await response.json();
  } finally {
    clearAuthSession();
  }
}

/**
 * Request a password reset token via `/auth/forgot-password`.
 */
export async function resetPassword(email: string) {
  const response = await fetch(`${API_BASE}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message ?? 'Reset password request failed');
  }
  return await response.json();
}
