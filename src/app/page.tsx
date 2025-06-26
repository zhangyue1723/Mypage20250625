import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';

export default async function Home() {
  const firstTutorial = await prisma.tutorial.findFirst({
    orderBy: {
      order: 'asc',
    },
    where: {
      order: {
        not: null,
      },
    },
  });

  if (firstTutorial) {
    redirect(`/tutorials/${firstTutorial.slug}`);
  }

  return (
    <div className="flex items-center justify-center h-full">
      <p className="text-text-main">No tutorials found. Create one in the admin dashboard.</p>
    </div>
  );
}
