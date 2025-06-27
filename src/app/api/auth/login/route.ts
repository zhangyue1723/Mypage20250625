import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Ensure you have a JWT_SECRET in your .env file
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET is not defined in the environment variables.');
    }

    const token = jwt.sign({ userId: user.id, username: user.username }, secret, {
      expiresIn: '1h',
    });

    const response = NextResponse.json({ message: 'Login successful' });
    
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: false, // Disable secure for HTTP connections
      maxAge: 60 * 60, // 1 hour
      path: '/',
      sameSite: 'lax',
    });

    console.log('Cookie set with token:', token.substring(0, 20) + '...');
    console.log('Environment:', process.env.NODE_ENV);
    console.log('Secure cookie:', process.env.NODE_ENV === 'production');

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 