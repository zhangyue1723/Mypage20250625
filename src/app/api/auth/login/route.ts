import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  console.log('=== LOGIN API CALLED ===');
  
  try {
    // Log environment check
    console.log('Environment variables check:');
    console.log('- NODE_ENV:', process.env.NODE_ENV);
    console.log('- DATABASE_URL exists:', !!process.env.DATABASE_URL);
    console.log('- JWT_SECRET exists:', !!process.env.JWT_SECRET);
    
    const body = await request.json();
    const { username, password } = body;
    
    console.log('Login attempt for username:', username);

    if (!username || !password) {
      console.log('Missing username or password');
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
    }

    // Test database connection
    console.log('Testing database connection...');
    try {
      await prisma.$connect();
      console.log('Database connection successful');
    } catch (dbError: any) {
      console.error('Database connection failed:', dbError);
      return NextResponse.json({ error: 'Database connection failed', details: dbError.message }, { status: 500 });
    }

    // Check if user exists
    console.log('Looking for user:', username);
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      console.log('User not found:', username);
      // List all users for debugging
      const allUsers = await prisma.user.findMany({ select: { id: true, username: true } });
      console.log('Available users:', allUsers);
      return NextResponse.json({ error: 'Invalid credentials', debug: 'User not found' }, { status: 401 });
    }

    console.log('User found:', { id: user.id, username: user.username });

    // Verify password
    console.log('Verifying password...');
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      console.log('Password verification failed');
      return NextResponse.json({ error: 'Invalid credentials', debug: 'Password mismatch' }, { status: 401 });
    }

    console.log('Password verified successfully');

    // Check JWT secret
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('JWT_SECRET is not defined');
      return NextResponse.json({ error: 'Server configuration error', debug: 'JWT_SECRET missing' }, { status: 500 });
    }

    console.log('Generating JWT token...');
    const token = jwt.sign({ userId: user.id, username: user.username }, secret, {
      expiresIn: '1h',
    });

    console.log('Token generated successfully');

    const response = NextResponse.json({ message: 'Login successful' });
    
    // More permissive cookie settings for HTTP and IP-based access
    response.cookies.set('token', token, {
      httpOnly: false, // Allow client-side access for debugging
      secure: false, // Always false for HTTP
      maxAge: 60 * 60, // 1 hour
      path: '/',
      sameSite: 'lax', // Compatible with HTTP and IP addresses
    });

    console.log('Cookie set with token:', token.substring(0, 20) + '...');
    console.log('Cookie settings: httpOnly=false, secure=false, sameSite=lax');
    console.log('Login completed successfully');

    return response;

  } catch (error: any) {
    console.error('=== LOGIN ERROR ===');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('Full error:', error);
    console.error('Stack trace:', error.stack);
    
    return NextResponse.json({ 
      error: 'Internal server error', 
      debug: error.message,
      type: error.constructor.name 
    }, { status: 500 });
  }
} 