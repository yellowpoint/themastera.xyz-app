import './globals.css'
import { Lexend } from 'next/font/google'
import { Providers } from './providers'
import { AppSidebar } from '@/components/app-sidebar'
import {
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar'
import TopHeader from '@/components/TopHeader'

export const metadata = {
  title: 'Mastera Platform - A Creative Platform for Creators and Fans',
  description: 'A creative platform connecting creators and fans, allowing everyone to discover and share exciting content. Supports multiple content types, a membership tier system, a points-based reward mechanism, and community interaction features.',
  keywords: 'creator platform, content sharing, community interaction, points system, membership tiers, creative content',
  authors: [{ name: 'Mastera Team' }],
}

const lexend = Lexend({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${lexend.variable} antialiased h-screen overflow-hidden`}>
        <Providers>
          <SidebarProvider>
            <AppSidebar className='pt-16' />
            <SidebarInset className="flex flex-col h-screen">
              <TopHeader />
              <div className="flex-1 mt-16 overflow-auto border-t-4 border-l-4 border-secondary">
                {children}
              </div>
            </SidebarInset>
          </SidebarProvider>
        </Providers>
      </body>
    </html>
  )
}
