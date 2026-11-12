// Updated auth service to use the custom API instead of Supabase for login/registration.
import type { LoginCredentials, RegisterData } from '../types';

// Base URL for the backend API – configure via environment variable.
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';

/**
 * Sign in using the backend `/auth/login` endpoint.
 * Returns the JSON response containing accessToken, refreshToken, and user data.
 */
export async function signIn({ email, password }: LoginCredentials) {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
    credentials: 'include', // include http‑only refresh cookie
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message ?? 'Login failed');
  }
  return await response.json();
}

/**
 * Register a new user via `/auth/signup/customer` or `/auth/signup/artisan`.
 * The `role` field determines which endpoint to hit.
 */
export async function signUp(data: RegisterData) {
  const endpoint = data.role === 'artisan' ? '/auth/signup/artisan' : '/auth/signup/customer';
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message ?? 'Sign‑up failed');
  }
  return await response.json();
}

/**
 * Sign out via the backend `/auth/logout` endpoint.
 */
export async function signOut() {
  const response = await fetch(`${API_BASE}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message ?? 'Logout failed');
  }
  return await response.json();
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
    const err = await response.json();
    throw new Error(err.message ?? 'Reset password request failed');
  }
  return await response.json();
}
