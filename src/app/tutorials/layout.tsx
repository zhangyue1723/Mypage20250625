import prisma from "@/lib/prisma";
import Link from 'next/link';
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

async function getTutorials() {
  try {
    const tutorials = await prisma.tutorial.findMany({
      select: {
        title: true,
        slug: true,
      },
      orderBy: {
        order: 'asc',
      },
    });
    return tutorials || [];
  } catch (error) {
    console.log('Database not accessible during build for tutorials layout:', error);
    // Return empty array if database is not accessible during build
    return [];
  }
}

export default async function TutorialLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const tutorials = await getTutorials();

  return (
    <>
        {/* Header/Breadcrumbs placeholder */}
        <header className="p-4 mb-4 border-b">
        {/* This should be dynamic later */}
        <p className="text-sm text-gray-500">LAMMPS Tutorials</p>
        </header>
        
        <div className="grid grid-cols-12 gap-8">
            <aside className="hidden md:block md:col-span-3 bg-gray-50 p-4 rounded">
                <h3 className="text-lg font-semibold mb-4">Tutorials</h3>
                <ul>
                    {tutorials.length > 0 ? (
                        tutorials.map((tutorial) => (
                        <li key={tutorial.slug} className="mb-2">
                            <Link href={`/tutorials/${tutorial.slug}`} className="text-blue-600 hover:underline">
                            {tutorial.title}
                            </Link>
                        </li>
                        ))
                    ) : (
                        <li className="text-gray-500 text-sm">
                            No tutorials available yet.
                        </li>
                    )}
                </ul>
            </aside>

            <div className="col-span-12 md:col-span-9">
                {children}
            </div>
        </div>

        <footer className="p-4 mt-8 text-center text-sm text-gray-500 border-t">
            <p>© Copyright 2024, LAMMPS Tutorials team.
            <br/>
            Created using Next.js and Tailwind CSS.
            </p>
        </footer>
    </>
  );
} 