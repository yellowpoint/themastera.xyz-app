import './globals.css'
import localFont from 'next/font/local'
import type { Metadata } from 'next'
import { Providers } from './providers'
import { AppSidebar } from '@/components/app-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import Header from '@/components/Header'
import AuthRequired from '@/components/auth-required'

export const metadata: Metadata = {
  title: 'Mastera Platform - A Creative Platform for Creators and Fans',
  description:
    'A creative platform connecting creators and fans, allowing everyone to discover and share exciting content. Supports multiple content types, a membership tier system, a points-based reward mechanism, and community interaction features.',
  keywords:
    'creator platform, content sharing, community interaction, points system, membership tiers, creative content',
  authors: [{ name: 'Mastera Team' }],
}

const lexend = localFont({
  variable: '--default-font-family',
  display: 'swap',
  preload: true,
  src: [
    {
      path: '../../node_modules/@fontsource/lexend/files/lexend-latin-400-normal.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../node_modules/@fontsource/lexend/files/lexend-latin-500-normal.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../node_modules/@fontsource/lexend/files/lexend-latin-600-normal.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../node_modules/@fontsource/lexend/files/lexend-latin-700-normal.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${lexend.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className={`h-screen overflow-hidden`}>
        <Providers>
          <SidebarProvider>
            <AppSidebar className="pt-16" />
            <SidebarInset className="flex flex-col h-screen">
              <Header />
              {/* border-t-4 border-l-4 border-secondary */}
              <div className="flex-1 mt-16 overflow-auto">
                <AuthRequired>{children}</AuthRequired>
              </div>
            </SidebarInset>
          </SidebarProvider>
        </Providers>
      </body>
    </html>
  )
}
