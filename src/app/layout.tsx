import { AppLayout } from '@/components/AppLayout'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import '@fontsource-variable/jost'
import type { Metadata } from 'next'
import './globals.css'

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
    <html lang="en" className="antialiased" suppressHydrationWarning>
      <head />
      <body>
        <GoogleAnalytics gaId="G-3R87FXD4BX" />
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  )
}
