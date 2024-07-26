import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from '@vercel/analytics/react';
import Image from "next/image";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/ui/theme";

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
        <body className={` min-h-screen ${inter.className}`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <header className="shadow-md">
              <div className="container mx-auto flex justify-between items-center py-4 px-8">
                <Link href="/" className="flex items-center space-x-2">
                  <Image src="/favicon.ico" alt="Bihance Logo" width={30} height={30} />
                  <span className="text-lg font-semibold">Bihance</span>
                </Link>
                <nav className="flex items-center space-x-6">
                  <SignedOut>
                    <Button>
                      <SignInButton />
                    </Button>
                  </SignedOut>
                  <SignedIn>
                    <UserButton />
                  </SignedIn>
                  <ModeToggle />
                </nav>
              </div>
            </header>
            <main className="mx-auto p-4">
              {children}
            </main>
            <footer className="mx-auto flex m-5 items-center justify-center">
                <Button asChild variant={"link"}>
                  <Link href="/cookies">Cookies</Link>
                </Button>
                <Button asChild variant={"link"}>
                  <Link href="/privacy">Privacy</Link>
                </Button>
                <Button asChild variant={"link"}>
                  <Link href="/service">Service</Link>
                </Button>
            </footer>
          </ThemeProvider>
          <Toaster />
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
