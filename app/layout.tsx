import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider, SignIn, SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bihance",
  description: "Take you attendance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body>
        <header className="bg-base-100">
          <SignedOut>
            <Button className="text-base-content">
            <SignInButton/>
            </Button>
          </SignedOut>
          <SignedIn>
            <div className="flex flex-row items-center w-full justify-around p-5">
            <Link href="/">
            <img src="/favicon.ico" className="size-10"/>
            </Link>
            <UserButton/>
            </div>

          </SignedIn>
        </header>
        <main className="bg-base-100 text-base-content">
          {children}
        </main>
      </body>
    </html>
  </ClerkProvider>
  );
}
