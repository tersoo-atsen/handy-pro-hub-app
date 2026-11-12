export interface AuthUser {
  id: string;
  email: string;
  full_name: string;
  role: 'customer' | 'artisan' | 'admin';
  avatar_url: string | null;
  is_verified: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  full_name: string;
  email: string;
  phone?: string;
  password: string;
  role: 'customer' | 'artisan';
}
