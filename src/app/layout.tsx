import type { Metadata } from "next";
import { Lato, Roboto_Slab } from "next/font/google";
import "./globals.css";
import 'katex/dist/katex.min.css';
import prisma from "@/lib/prisma";
import Link from 'next/link';
import { notFound } from "next/navigation";

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-lato",
});

const robotoSlab = Roboto_Slab({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-roboto-slab",
});

export const metadata: Metadata = {
  title: "LAMMPS Tutorials",
  description: "A replica of the LAMMPS tutorial website.",
};

export const dynamic = 'force-dynamic';

async function getTutorials() {
  const tutorials = await prisma.tutorial.findMany({
    select: {
      title: true,
      slug: true,
    },
    orderBy: {
      order: 'asc',
    },
  });
  if (!tutorials) {
    notFound();
  }
  return tutorials;
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const tutorials = await getTutorials();

  return (
    <html lang="en" className={`${lato.variable} ${robotoSlab.variable} antialiased`}>
      <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/katex.min.css" />
      </head>
      <body>
        <div className="max-w-8xl mx-auto">
          {/* Header/Breadcrumbs placeholder */}
          <header className="p-4 mb-4 border-b border-border-main">
            <p className="text-sm text-gray-500">LAMMPS Tutorials » Tutorial 1: Lennard-Jones Fluid</p>
          </header>
          
          <div className="grid grid-cols-12 gap-8">
            <aside className="hidden md:block md:col-span-3 bg-sidebar p-4 rounded">
              <h3 className="text-lg font-semibold mb-4 text-text-heading">Tutorials</h3>
              <ul>
                {tutorials.map((tutorial) => (
                  <li key={tutorial.slug} className="mb-2">
                    <Link href={`/tutorials/${tutorial.slug}`} className="text-brand-blue hover:underline">
                      {tutorial.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </aside>

            <main className="col-span-12 md:col-span-7 bg-main p-8 rounded shadow-sm">
              {children}
            </main>

            <aside className="hidden lg:block lg:col-span-2 p-4">
              <h4 className="font-semibold mb-2 text-text-heading">On this page</h4>
               {/* Right sidebar content will be dynamic */}
              <ul>
                <li className="mb-1"><a href="#" className="text-sm text-brand-blue hover:underline">Section 1</a></li>
                <li className="mb-1"><a href="#" className="text-sm text-gray-700 hover:underline">Section 2</a></li>
              </ul>
            </aside>
          </div>

          <footer className="p-4 mt-8 text-center text-sm text-gray-500 border-t border-border-main">
            <p>© Copyright 2024, LAMMPS Tutorials team.
            <br/>
            Created using Next.js and Tailwind CSS.
            </p>
          </footer>
        </div>
      </body>
    </html>
  );
}
