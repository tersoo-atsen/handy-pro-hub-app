import { NextResponse, type NextRequest } from 'next/server';

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:5000').trim();

function getDashboardForRole(role?: string): string {
  switch (role) {
    case 'admin':
      return '/admin/dashboard';
    case 'artisan':
      return '/artisan/dashboard';
    default:
      return '/customer/dashboard';
  }
}

export async function updateSession(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes do not require authentication
  const publicRoutes = [
    '/',
    '/login',
    '/register',
    '/forgot-password',
    '/callback',
    '/search',
    '/services',
    '/professionals',
    '/about',
    '/contact',
  ];
  const isPublicRoute = publicRoutes.some(
    (route) =>
      pathname === route ||
      pathname.startsWith(`${route}/`) ||
      pathname.startsWith('/api/')
  );

  if (isPublicRoute) {
    return NextResponse.next({ request });
  }

  // Check for backend auth cookie (`access_token` or `handy_user`)
  const accessToken = request.cookies.get('access_token')?.value;
  const handyUser = request.cookies.get('handy_user')?.value;

  if (!accessToken && !handyUser) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // Verify session & enforce role-based access for protected route groups
  const isAdminRoute = pathname === '/admin' || pathname.startsWith('/admin/');
  const isArtisanRoute = pathname === '/artisan' || pathname.startsWith('/artisan/');
  const isCustomerRoute = pathname === '/customer' || pathname.startsWith('/customer/');

  if (isAdminRoute || isArtisanRoute || isCustomerRoute) {
    let role: string | undefined;

    if (accessToken) {
      try {
        const res = await fetch(`${API_BASE}/auth/me`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Cookie: request.headers.get('cookie') ?? '',
          },
          cache: 'no-store',
        });

        if (!res.ok) {
          const url = request.nextUrl.clone();
          url.pathname = '/login';
          return NextResponse.redirect(url);
        }

        const user = await res.json();
        role = user?.role;
      } catch {
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        return NextResponse.redirect(url);
      }
    } else if (handyUser) {
      try {
        const parsed = JSON.parse(decodeURIComponent(handyUser));
        role = parsed?.role;
      } catch {
        role = undefined;
      }
    }

    if (!role) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }

    if (isAdminRoute && role !== 'admin') {
      const url = request.nextUrl.clone();
      url.pathname = getDashboardForRole(role);
      return NextResponse.redirect(url);
    }

    if (isArtisanRoute && role !== 'artisan' && role !== 'admin') {
      const url = request.nextUrl.clone();
      url.pathname = getDashboardForRole(role);
      return NextResponse.redirect(url);
    }

    if (isCustomerRoute && role !== 'customer' && role !== 'admin') {
      const url = request.nextUrl.clone();
      url.pathname = getDashboardForRole(role);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next({ request });
}
