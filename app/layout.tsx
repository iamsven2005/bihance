import Provider from '@/app/provider'
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { ClerkProvider } from '@clerk/nextjs'
import { Analytics } from "@vercel/analytics/react"
import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans';
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL("https://starter.rasmic.xyz"),
  title: {
    default: 'Bihance',
    template: `%s | Bihance`
  },
  openGraph: {
    description: 'Build your next SAAS product',
    images: ['']
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nextjs Starter ',
    description: 'Build your next SAAS product.',
    siteId: "",
    creator: "@rasmic",
    creatorId: "",
    images: [''],
  },
}
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={GeistSans.className}>
          <Provider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
            {children}
            <Toaster />
            </ThemeProvider>
          </Provider>
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  )
}