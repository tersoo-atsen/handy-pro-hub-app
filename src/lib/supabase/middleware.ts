import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes do not require authentication
  const publicRoutes = ['/', '/login', '/register', '/forgot-password', '/callback', '/search'];
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
  const token =
    request.cookies.get('access_token')?.value ||
    request.cookies.get('handy_user')?.value;

  if (!token) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  return NextResponse.next({ request });
}
