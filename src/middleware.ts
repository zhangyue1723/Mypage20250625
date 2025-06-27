import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAuth } from './lib/auth';

export async function middleware(request: NextRequest) {
  console.log('=== MIDDLEWARE CALLED ===');
  console.log('Path:', request.nextUrl.pathname);
  console.log('Cookies:', request.cookies.toString());
  
  const loginUrl = new URL('/admin/login', request.url);
  const dashboardUrl = new URL('/admin/dashboard', request.url);

  const { user } = await verifyAuth(request);
  console.log('Auth result:', user ? 'AUTHENTICATED' : 'NOT AUTHENTICATED');
  if (user) {
    console.log('User details:', user);
  }

  const isLoginPage = request.nextUrl.pathname === '/admin/login';
  console.log('Is login page:', isLoginPage);

  // If user is authenticated
  if (user) {
    console.log('User is authenticated');
    // If they are trying to access the login page, redirect to dashboard
    if (isLoginPage) {
      console.log('Redirecting authenticated user from login to dashboard');
      return NextResponse.redirect(dashboardUrl);
    }
    // Otherwise, let them proceed
    console.log('Allowing authenticated user to proceed');
    return NextResponse.next();
  }

  // If user is not authenticated and not on the login page, redirect to login
  if (!user && !isLoginPage) {
    console.log('Redirecting unauthenticated user to login');
    const response = NextResponse.redirect(loginUrl);
    // It's good practice to clear any invalid token that might be present
    response.cookies.delete('token');
    return response;
  }

  // If user is not authenticated and on the login page, let them proceed
  console.log('Allowing unauthenticated user to access login page');
  return NextResponse.next();
}

export const config = {
  // Match all routes under /admin, including the login page itself.
  matcher: ['/admin/:path*'],
}; 