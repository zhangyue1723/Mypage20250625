import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function POST(request: Request) {
  const verification = await verifyAuth(request);
  if (!verification.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const body = await request.json();
    const { title, slug, content } = body;

    if (!title || !slug || !content) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const existingTutorial = await prisma.tutorial.findUnique({
      where: { slug },
    });

    if (existingTutorial) {
      return NextResponse.json(
        { message: 'Slug already exists' },
        { status: 409 }
      );
    }
    
    const highestOrderTutorial = await prisma.tutorial.findFirst({
      orderBy: {
        order: 'desc',
      },
      where: {
        order: {
            not: null
        }
      }
    });

    const newOrder = highestOrderTutorial?.order != null ? highestOrderTutorial.order + 1 : 1;

    const tutorial = await prisma.tutorial.create({
      data: {
        title,
        slug,
        content,
        order: newOrder,
      },
    });

    revalidatePath('/');
    revalidatePath('/admin/dashboard');

    return NextResponse.json(tutorial, { status: 201 });
  } catch (error) {
    console.error('Failed to create tutorial:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 