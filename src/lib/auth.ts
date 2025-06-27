import jwt from 'jsonwebtoken';
import type { NextRequest } from 'next/server';

interface UserJwtPayload {
  userId: string;
  username: string;
  iat: number;
  exp: number;
}

export async function verifyAuth(request: NextRequest | Request) {
  console.log('=== VERIFY AUTH CALLED ===');
  let token: string | undefined;

  // Try to get token from cookies
  if ('cookies' in request && request.cookies.get) {
    // NextRequest
    console.log('Using NextRequest cookie method');
    const cookieObj = request.cookies.get('token');
    token = cookieObj?.value;
    console.log('Token from cookies.get():', token ? token.substring(0, 20) + '...' : 'undefined');
  } else {
    // Regular Request - parse from cookie header
    console.log('Using Request cookie header method');
    const cookieHeader = request.headers.get('cookie');
    console.log('Cookie header:', cookieHeader);
    if (cookieHeader) {
      const match = cookieHeader.match(/(?:^|; )token=([^;]*)/);
      token = match ? decodeURIComponent(match[1]) : undefined;
      console.log('Token from header:', token ? token.substring(0, 20) + '...' : 'undefined');
    }
  }

  if (!token) {
    console.log('❌ No token found in cookies');
    return { user: null };
  }

  console.log('✅ Token found, verifying...');

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('❌ JWT_SECRET not defined');
      return { user: null };
    }

    console.log('JWT_SECRET exists, verifying token...');
    const payload = jwt.verify(token, secret) as UserJwtPayload;
    console.log('✅ Token verified successfully:', payload);
    return { user: payload };
  } catch (error: any) {
    console.error('❌ Token verification failed:', error.message);
    console.error('Error type:', error.constructor.name);
    return { user: null };
  }
} 