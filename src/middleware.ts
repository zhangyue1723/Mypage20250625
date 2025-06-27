import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAuth } from './lib/auth';

export async function middleware(request: NextRequest) {
  const loginUrl = new URL('/admin/login', request.url);
  const dashboardUrl = new URL('/admin/dashboard', request.url);

  const { user } = await verifyAuth(request);

  const isLoginPage = request.nextUrl.pathname === '/admin/login';

  // If user is authenticated
  if (user) {
    // If they are trying to access the login page, redirect to dashboard
    if (isLoginPage) {
      return NextResponse.redirect(dashboardUrl);
    }
    // Otherwise, let them proceed
    return NextResponse.next();
  }

  // If user is not authenticated and not on the login page, redirect to login
  if (!user && !isLoginPage) {
    const response = NextResponse.redirect(loginUrl);
    // It's good practice to clear any invalid token that might be present
    response.cookies.delete('token');
    return response;
  }

  // If user is not authenticated and on the login page, let them proceed
  return NextResponse.next();
}

export const config = {
  // Match all routes under /admin, including the login page itself.
  matcher: ['/admin/:path*'],
}; 