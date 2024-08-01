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
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bihance",
  description: "Enhance your business",
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

                <Sheet >
                  <SheetTrigger><Menu /></SheetTrigger>
                  <SheetContent side={"left"}>
                    <SheetHeader>
                      <SheetTitle>      <Link href="/" className="flex items-center space-x-2">
                        <Image src="/favicon.ico" alt="Bihance Logo" width={30} height={30} />
                        <span className="text-lg font-semibold">Bihance</span>
                      </Link></SheetTitle>
                      <SheetDescription>
                      </SheetDescription>
                      <Link href="/blog"><Button className="w-full">
                        Blog
                      </Button>
                      </Link>
                      <Link href="/event"><Button className="w-full">
                        Dashboard
                      </Button>
                      </Link>
                      <Link href="/event"><Button className="w-full">
                        Create Event
                      </Button>
                      </Link>
                      <Link href="/blog/faq"><Button className="w-full">
                        FAQ
                      </Button>
                      </Link>
                      <Link href="/vote"><Button className="w-full">
                        Vote For Features
                      </Button>
                      </Link>                    </SheetHeader>
                  </SheetContent>
                </Sheet>

                <nav className="flex items-center space-x-6">
                  <SignedOut>
                    <SignInButton />
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
            <footer className="mx-auto flex m-5 items-center justify-center flex-col">
              <div>
              <Button asChild variant={"link"}>
                <Link href="/cookies">Cookies</Link>
              </Button>
              <Button asChild variant={"link"}>
                <Link href="/privacy">Privacy</Link>
              </Button>
              <Button asChild variant={"link"}>
                <Link href="/service">Service</Link>
              </Button>
              </div>
              
            <div className="flex gap-5">
            <Link href="https://www.instagram.com/bihance.app?igsh=a2I4Z2d6ODlkbHQ4">
              <Avatar>
                <AvatarFallback>IG</AvatarFallback>
              </Avatar>
            </Link>
            <Link href="https://www.linkedin.com/company/bihance-app/">
              <Avatar>
                <AvatarFallback>In</AvatarFallback>
              </Avatar>
            </Link>
            <Link href="https://wa.me/92962690/?text=I+am+looking+to+enquire+">
              <Avatar>
                <AvatarFallback>Wa</AvatarFallback>
              </Avatar>
            </Link>
            <Link href="mailto:support@bihance.app">
              <Avatar>
                <AvatarFallback>Gm</AvatarFallback>
              </Avatar>
            </Link>
            </div>
            
            </footer>
          </ThemeProvider>
          <Toaster />
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
