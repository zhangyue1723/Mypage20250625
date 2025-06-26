import type { Metadata } from "next";
import { Lato, Roboto_Slab } from "next/font/google";
import "./globals.css";
import 'katex/dist/katex.min.css';

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${lato.variable} ${robotoSlab.variable} antialiased`}>
      <head />
      <body>
        <div className="max-w-8xl mx-auto">
            <main>
              {children}
            </main>
        </div>
      </body>
    </html>
  );
}
