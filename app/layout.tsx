import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider, OrganizationSwitcher, SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from '@vercel/analytics/react';
import Image from "next/image";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/ui/theme";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu, LayoutDashboard, Calendar, Users, Settings, HelpCircle, LogOut, ClipboardCheck } from "lucide-react";
import { SpeedInsights } from "@vercel/speed-insights/next"
import ConvexClientProvider from "./ConvexClientProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bihance - Enhance Your Business",
  description: "Streamline your business operations with Bihance",
};

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/edit-event", icon: Calendar, label: "Add event" },
  { href: "/workspace", icon: Users, label: "Workspace" },
  { href: "/board", icon: ClipboardCheck, label: "Board" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexClientProvider>
      <html lang="en" className="h-full">
        <body className={`h-full ${inter.className}`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="flex h-full">
              {/* Sidebar */}
              <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:border-r lg:bg-gray-100 dark:bg-gray-900">
                <div className="flex items-center h-16 px-4 border-b">
                  <Link href="/" className="flex items-center space-x-2">
                    <Image src="/favicon.ico" alt="Bihance Logo" width={30} height={30} />
                    <span className="text-lg font-semibold">Bihance</span>
                  </Link>
                </div>
                <nav className="flex-1 p-4 space-y-1">
                  {navItems.map((item) => (
                    <Link key={item.href} href={item.href}>
                      <div className="flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-gray-200 dark:hover:bg-gray-800">
                        <item.icon className="mr-3 h-5 w-5" />
                        {item.label}
                      </div>
                    </Link>
                  ))}
                </nav>
                <div className="p-4 border-t bg-white">
                  <SignedIn>
                    <OrganizationSwitcher
                      hidePersonal
                      afterCreateOrganizationUrl="/workspace/:id"
                      afterLeaveOrganizationUrl="/dashboard"
                      afterSelectOrganizationUrl="/workspace/:id"
                      appearance={{
                        elements: {
                          rootBox: {
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            width: "100%",
                          },
                        },
                      }}
                    />
                  </SignedIn>
                </div>
              </aside>

              {/* Main content */}
              <div className="flex-1 flex flex-col min-h-screen lg:pl-64">
                {/* Header */}
                <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                  <div className="flex items-center space-x-4">
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="lg:hidden">
                          <Menu />
                        </Button>
                      </SheetTrigger>
                      <SheetContent side="left" className="w-64">
                        <SheetHeader>
                          <SheetTitle>
                            <Link href="/" className="flex items-center space-x-2">
                              <Image src="/favicon.ico" alt="Bihance Logo" width={30} height={30} />
                              <span className="text-lg font-semibold">Bihance</span>
                            </Link>
                          </SheetTitle>
                        </SheetHeader>
                        <nav className="flex flex-col space-y-1 mt-4">
                          {navItems.map((item) => (
                            <Link key={item.href} href={item.href}>
                              <div className="flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-gray-200 dark:hover:bg-gray-800">
                                <item.icon className="mr-3 h-5 w-5" />
                                {item.label}
                              </div>
                            </Link>
                          ))}
                        </nav>
                        <div className="p-4 border-t bg-white">
                  <SignedIn>
                    <OrganizationSwitcher
                      hidePersonal
                      afterCreateOrganizationUrl="/workspace/:id"
                      afterLeaveOrganizationUrl="/dashboard"
                      afterSelectOrganizationUrl="/workspace/:id"
                      appearance={{
                        elements: {
                          rootBox: {
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            width: "100%",
                          },
                        },
                      }}
                    />
                  </SignedIn>
                </div>
                      </SheetContent>
                    </Sheet>
                  </div>
                  <div className="flex items-center space-x-4">
                    <ModeToggle />
                    <SignedOut>
                      <SignInButton mode="modal">
                        <Button>Sign In</Button>
                      </SignInButton>
                    </SignedOut>
                    <SignedIn>
                      <UserButton
                        appearance={{
                          elements: {
                            avatarBox: {
                              width: 32,
                              height: 32,
                            },
                          },
                        }}
                      />
                    </SignedIn>
                  </div>
                </header>

                {/* Main content */}
                <main className="flex-1 overflow-y-auto p-4">
                  {children}
                </main>

                {/* Footer */}
                <footer className="border-t py-6 px-4">
                  <div className="container mx-auto flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
                    <div className="flex space-x-4">
                      <Link href="/privacy" className="text-sm text-muted-foreground hover:underline">
                        Privacy Policy
                      </Link>
                      <Link href="/terms" className="text-sm text-muted-foreground hover:underline">
                        Terms of Service
                      </Link>
                      <Link href="/cookies" className="text-sm text-muted-foreground hover:underline">
                        Cookies
                      </Link>
                    </div>
                    <div className="flex items-center space-x-6">
                      <Link href="https://www.instagram.com/bihance.app" className="text-gray-400 hover:text-gray-500">
                        <span className="sr-only">Instagram</span>
                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                        </svg>
                      </Link>
                      <Link href="https://www.linkedin.com/company/bihance-app/" className="text-gray-400 hover:text-gray-500">
                        <span className="sr-only">LinkedIn</span>
                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                        </svg>
                      </Link>
                      <Link href="https://wa.me/89342899/?text=I+am+looking+to+enquire+" className="text-gray-400 hover:text-gray-500">
                        <span className="sr-only">WhatsApp</span>
                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path fillRule="evenodd" d="M20.472 3.528C18.208 1.264 15.136 0 11.888 0 5.392 0 0.112 5.28 0.112 11.776c0 2.08 0.544 4.112 1.584 5.904L0 24l6.464-1.696c1.728 0.944 3.68 1.44 5.664 1.44h0.004c6.496 0 11.776-5.28 11.776-11.776 0-3.248-1.264-6.32-3.536-8.584zM11.888 21.536c-1.76 0-3.488-0.48-4.992-1.36l-0.36-0.216-3.712 0.976 0.992-3.632-0.232-0.368c-0.976-1.552-1.488-3.344-1.488-5.2 0-5.376 4.368-9.744 9.744-9.744 2.608 0 5.056 1.016 6.896 2.856 1.84 1.84 2.856 4.288 2.856 6.896 0 5.376-4.368 9.744-9.744 9.744zM17.264 14.24c-0.288-0.144-1.728-0.848-1.992-0.944-0.264-0.096-0.456-0.144-0.648 0.144-0.192 0.288-0.744 0.944-0.912 1.136-0.168 0.192-0.336 0.216-0.624 0.072-0.288-0.144-1.216-0.448-2.32-1.424-0.856-0.768-1.44-1.712-1.608-2-0.168-0.288-0.016-0.448 0.128-0.592 0.128-0.128 0.288-0.336 0.432-0.504 0.144-0.168 0.192-0.288 0.288-0.48 0.096-0.192 0.048-0.36-0.024-0.504-0.072-0.144-0.648-1.56-0.888-2.136-0.232-0.56-0.472-0.48-0.648-0.48-0.168-0.016-0.36-0.016-0.552-0.016-0.192 0-0.504 0.072-0.768 0.36-0.264 0.288-1.008 0.984-1.008 2.4 0 1.416 1.032 2.784 1.176 2.976 0.144 0.192 2.04 3.12 4.944 4.368 0.688 0.296 1.224 0.472 1.644 0.608 0.688 0.216 1.32 0.184 1.816 0.112 0.552-0.08 1.704-0.696 1.944-1.36 0.24-0.664 0.24-1.24 0.168-1.36-0.072-0.12-0.264-0.192-0.552-0.336z" clipRule="evenodd" />
                        </svg>
                      </Link>
                      <Link href="mailto:support@bihance.app" className="text-gray-400 hover:text-gray-500">
                        <span className="sr-only">Email</span>
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </footer>
              </div>
            </div>
            <Toaster />
            <Analytics />
            <SpeedInsights />
          </ThemeProvider>
        </body>
      </html>
    </ConvexClientProvider>
  );
}