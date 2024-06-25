import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider, SignIn, SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

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
        <header className="navbar bg-base-100">
          <h1 className="text-base-content text-5xl font-bold">
            Bihance
          </h1>
          <SignedOut>
            <Button className="text-base-content">
            <SignInButton/>
            </Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </header>
        <main>
          {children}
        </main>
      </body>
    </html>
  </ClerkProvider>
  );
}
