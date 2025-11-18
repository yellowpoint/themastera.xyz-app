import { AppLayout } from '@/components/AppLayout'
import { AppSidebar } from '@/components/app-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'Mastera Platform - A Creative Platform for Creators and Fans',
  description:
    'A creative platform connecting creators and fans, allowing everyone to discover and share exciting content. Supports multiple content types, a membership tier system, a points-based reward mechanism, and community interaction features.',
  keywords:
    'creator platform, content sharing, community interaction, points system, membership tiers, creative content',
  authors: [{ name: 'Mastera Team' }],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`antialiased`} suppressHydrationWarning>
      <head>
        {/* Google tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-3R87FXD4BX"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);} 
            gtag('js', new Date());
            gtag('config', 'G-3R87FXD4BX');
          `}
        </Script>
      </head>
      <body>
        <Providers>
          <SidebarProvider defaultOpen={false}>
            <AppSidebar className="pt-16" />
            <SidebarInset className="flex flex-col">
              <AppLayout>{children}</AppLayout>
            </SidebarInset>
          </SidebarProvider>
        </Providers>
      </body>
    </html>
  )
}
