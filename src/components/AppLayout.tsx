'use client'

import Header, { HeaderHeight } from '@/components/Header'
import { usePathname } from 'next/navigation'
import BackgroundSwitcher from './BackgroundSwitcher'
import CustomSidebar, { CustomSidebarWidth } from './CustomSidebar'
import AuthRequired from './auth-required'

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const hideHeader = ['/beta-notice'].some((prefix) =>
    pathname?.startsWith(prefix)
  )
  const showBackOnRoutes = [
    '/section',
    '/playlists/',
    '/user',
    '/creator/',
  ].some((prefix) => pathname?.startsWith(prefix))
  const hideHeaderRightPadding = [
    '/content',
    '/creator',
    '/user',
    '/auth',
    '/admin',
  ].some((prefix) => pathname?.startsWith(prefix))
  const hideSidebar = [
    '/content',
    '/user',
    '/beta-notice',
    '/auth',
    '/admin',
  ].some((prefix) => pathname?.startsWith(prefix))
  const showBackgroundImage =
    pathname === '/' ||
    [
      '/explore',
      '/playlists',
      '/auth',
      '/profile',
      '/section',
      '/ranking',
      '/event',
      '/shop',
      '/treasures',
    ].some((prefix) => pathname?.startsWith(prefix))

  const sidebarStyle = {
    top: hideHeader ? '0' : HeaderHeight,
    height: hideHeader ? '100%' : `calc(100vh - ${HeaderHeight})`,
  }

  return (
    <AuthRequired>
      <div className="flex flex-col h-screen overflow-hidden">
        <BackgroundSwitcher enabled={showBackgroundImage} />
        <div className={`relative z-20 flex-1 h-full overflow-y-auto `}>
          {!hideHeader && (
            <Header
              showBackButton={showBackOnRoutes}
              showLogo={!showBackOnRoutes}
            />
          )}
          <div className={`flex h-full ${!hideHeader ? 'pt-16' : ''}`}>
            {!hideSidebar ? <CustomSidebar style={sidebarStyle} /> : null}
            <div
              className="flex-1"
              style={{
                height: hideSidebar ? '100%' : `calc(100vh - ${HeaderHeight})`,
                paddingLeft: hideSidebar ? '0' : CustomSidebarWidth,
                paddingRight:
                  hideHeader || hideHeaderRightPadding
                    ? '0'
                    : CustomSidebarWidth,
              }}
            >
              {children}
            </div>
          </div>
        </div>
      </div>
    </AuthRequired>
  )
}
