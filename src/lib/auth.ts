import jwt from 'jsonwebtoken';
import type { NextRequest } from 'next/server';

interface UserJwtPayload {
  userId: string;
  username: string;
  iat: number;
  exp: number;
}

export async function verifyAuth(request: NextRequest | Request) {
  let token: string | undefined;

  // Try to get token from cookies
  if ('cookies' in request && request.cookies.get) {
    // NextRequest
    token = request.cookies.get('token')?.value;
  } else {
    // Regular Request - parse from cookie header
    const cookieHeader = request.headers.get('cookie');
    if (cookieHeader) {
      const match = cookieHeader.match(/(?:^|; )token=([^;]*)/);
      token = match ? decodeURIComponent(match[1]) : undefined;
    }
  }

  if (!token) {
    console.log('No token found in cookies');
    return { user: null };
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('JWT_SECRET not defined');
      return { user: null };
    }

    const payload = jwt.verify(token, secret) as UserJwtPayload;
    console.log('Token verified successfully:', payload);
    return { user: payload };
  } catch (error) {
    console.error('Token verification failed:', error);
    return { user: null };
  }
} 