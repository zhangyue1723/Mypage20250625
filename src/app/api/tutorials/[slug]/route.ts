import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

type RouteContext = {
  params: { slug: string };
};

// GET a single tutorial
export async function GET(
  request: Request,
  { params }: RouteContext
) {
  try {
    const { slug } = params;
    const tutorial = await prisma.tutorial.findUnique({
      where: { slug },
    });

    if (!tutorial) {
      return NextResponse.json({ message: 'Tutorial not found' }, { status: 404 });
    }

    return NextResponse.json(tutorial);
  } catch (error) {
    console.error('Failed to fetch tutorial:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// UPDATE a tutorial
export async function PUT(
  request: Request,
  { params }: RouteContext
) {
  const verification = await verifyAuth(request);
  if (!verification.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { slug: currentSlug } = params;
    const body = await request.json();
    const { title, slug, content } = body;

    if (!title || !slug || !content) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // If the slug is being changed, check if the new slug is already taken
    if (currentSlug !== slug) {
        const existingTutorial = await prisma.tutorial.findUnique({
            where: { slug },
        });

        if (existingTutorial) {
            return NextResponse.json(
                { message: 'New slug already exists' },
                { status: 409 }
            );
        }
    }
    
    const updatedTutorial = await prisma.tutorial.update({
      where: { slug: currentSlug },
      data: {
        title,
        slug,
        content,
      },
    });

    revalidatePath('/');
    revalidatePath(`/tutorials/${slug}`);
    revalidatePath('/admin/dashboard');

    return NextResponse.json(updatedTutorial);
  } catch (error) {
    console.error('Failed to update tutorial:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// DELETE a tutorial
export async function DELETE(
    request: Request,
    { params }: RouteContext
) {
    const verification = await verifyAuth(request);
    if (!verification.user) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { slug } = params;
        await prisma.tutorial.delete({
            where: { slug },
        });

        revalidatePath('/');
        revalidatePath(`/tutorials/${slug}`);
        revalidatePath('/admin/dashboard');

        return new NextResponse(null, { status: 204 }); // No Content
    } catch (error) {
        console.error('Failed to delete tutorial:', error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
} 