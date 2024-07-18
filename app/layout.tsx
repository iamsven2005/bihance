import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from '@vercel/analytics/react';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bihance",
  description: "Enhance your jobs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="min-h-100">
        <head>
          <meta name="robots" content="index, follow" />
          <link rel="icon" href="/favicon.ico" />
          <title>Bihance</title>
          <meta name="description" content="Enhance your jobs" />
        </head>
        <body className={inter.className}>
          <header className="bg-base-100 shadow-md">
            <div className="container mx-auto flex justify-between items-center p-4">
              <Link href="/">
                <img src="/favicon.ico" className="h-10 w-10" alt="Bihance Logo" />
              </Link>
              <nav className="flex items-center space-x-4">
                <SignedOut>
                  <Button className="btn">
                    <SignInButton />
                  </Button>
                </SignedOut>
                <SignedIn>
                  <UserButton />
                </SignedIn>
              </nav>
            </div>
          </header>
          <main className="mx-auto p-4 bg-base-100 text-base-content">
            {children}
          </main>
          <footer className="bg-base-100 border-t">
            <div className="container mx-auto p-4 text-center">
              <Link href="/cookies" className="btn btn-link">Cookies</Link>
              <Link href="/privacy" className="btn btn-link">Privacy</Link>
              <Link href="/service" className="btn btn-link">Service</Link>
            </div>
          </footer>
          <Toaster />
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
