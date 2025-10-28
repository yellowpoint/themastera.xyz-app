import './globals.css'
import { Providers } from './providers'
import { AppSidebar } from '@/components/app-sidebar'
import {
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar'
import TopHeader from '@/components/TopHeader'
import { ThemeProvider } from '@/components/theme-provider'

export const metadata = {
  title: 'Mastera Platform - A Creative Platform for Creators and Fans',
  description: 'A creative platform connecting creators and fans, allowing everyone to discover and share exciting content. Supports multiple content types, a membership tier system, a points-based reward mechanism, and community interaction features.',
  keywords: 'creator platform, content sharing, community interaction, points system, membership tiers, creative content',
  authors: [{ name: 'Mastera Team' }],
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className="antialiased">
        <Providers>
          <SidebarProvider>
            <AppSidebar className='pt-16' />
            <SidebarInset>
              <TopHeader />
              <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                {children}
              </div>
            </SidebarInset>
          </SidebarProvider>
        </Providers>
      </body>
    </html>
  )
}
