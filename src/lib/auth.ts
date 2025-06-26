import { jwtVerify } from 'jose';
import type { NextRequest } from 'next/server';

interface UserJwtPayload {
  jti: string;
  iat: number;
}

export async function verifyAuth(request: NextRequest | Request) {
  const token = request.headers.get('cookie')?.match(/(?<=token=)[^;]+/)
    ?.[0]
    // Fallback for NextRequest
    ?? ('cookies' in request ? request.cookies.get('token')?.value : undefined);

  if (!token) {
    return { user: null };
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET must be defined');
    const secretKey = new TextEncoder().encode(secret);
    const { payload } = await jwtVerify<UserJwtPayload>(token, secretKey);
    return { user: payload };
  } catch (error) {
    return { user: null };
  }
} 