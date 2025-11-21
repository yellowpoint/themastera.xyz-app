'use client'

import Header, { HeaderHeight } from '@/components/Header'
import { usePathname } from 'next/navigation'
import BackgroundSwitcher from './BackgroundSwitcher'
import CustomSidebar from './CustomSidebar'
import AuthRequired from './auth-required'

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const hideHeader = ['/content', '/section', '/playlists/'].some((prefix) =>
    pathname?.startsWith(prefix)
  )
  const hideSidebar = pathname?.startsWith('/content/')
  const showBackgroundImage =
    pathname === '/' ||
    ['/explore'].some((prefix) => pathname?.startsWith(prefix))

  const sidebarStyle = {
    top: hideHeader ? '0' : HeaderHeight,
    height: hideHeader ? '100%' : `calc(100vh - ${HeaderHeight})`,
  }

  return (
    <div className="flex flex-col h-screen">
      <BackgroundSwitcher enabled={showBackgroundImage} />
      {!hideHeader && <Header />}
      <div
        className={`relative z-20 flex-1 h-full ${!hideHeader ? 'mt-16' : 'pt-6'}`}
      >
        <div className="flex min-h-full">
          {!hideSidebar ? <CustomSidebar style={sidebarStyle} /> : null}
          <div className="flex-1">
            <AuthRequired>{children}</AuthRequired>
          </div>
        </div>
      </div>
    </div>
  )
}
