'use client'

import Header, { HeaderHeight } from '@/components/Header'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { useIsMobile } from '@/hooks/use-mobile'
import { AuthProvider } from '@/hooks/useAuth'
import { usePathname } from 'next/navigation'
import BackgroundSwitcher from './BackgroundSwitcher'
import CustomSidebar, { CustomSidebarWidth } from './CustomSidebar'
import AuthRequired from './auth-required'

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isMobile = useIsMobile()

  const isLightModePath =
    ['/creator', '/admin'].some((p) => pathname?.startsWith(p)) ?? false

  const hideHeader = ['/beta-notice'].some((prefix) =>
    pathname?.startsWith(prefix)
  )

  const showBackOnRoutes = [
    '/section',
    '/playlists/',
    '/user',
    '/creator',
    '/content/',
    '/event/',
  ].some((prefix) => pathname?.startsWith(prefix))

  const showSidebarController =
    isMobile &&
    [
      '/ranking',
      '/event',
      '/shop',
      '/treasures',
      '/privacy-policy',
      '/terms-of-service',
    ].some((prefix) => pathname?.startsWith(prefix))

  const hideHeaderRightPadding = [
    '/content',
    '/creator',
    '/user',
    '/auth',
    // '/admin',
  ].some((prefix) => pathname?.startsWith(prefix))

  const hideSidebar = [
    '/content',
    '/user',
    '/beta-notice',
    '/auth',
    '/admin',
    '/creator',
    '/event/',
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

  const getHideHeader = () => {
    if (showSidebarController) return false
    if (showBackOnRoutes) return false
    if (hideHeader) return true
    if (isMobile) return true
    return false
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      forcedTheme={isLightModePath ? 'light' : 'dark'}
      enableSystem={false}
    >
      <AuthProvider>
        <Toaster position="top-center" />
        <AuthRequired>
          <div className="flex flex-col h-screen overflow-hidden">
            {!isMobile && <BackgroundSwitcher enabled={showBackgroundImage} />}
            <div className={`relative z-20 flex-1 h-full overflow-y-auto `}>
              {!getHideHeader() && (
                <Header
                  showSidebarController={showSidebarController}
                  showBackButton={showBackOnRoutes}
                  showLogo={!showBackOnRoutes && !showSidebarController}
                />
              )}
              <div className={`flex h-full ${!hideHeader ? 'pt-16' : ''}`}>
                {!hideSidebar && !isMobile ? (
                  <CustomSidebar style={sidebarStyle} />
                ) : null}
                <div
                  className="flex-1"
                  style={{
                    height: hideSidebar
                      ? '100%'
                      : `calc(100vh - ${HeaderHeight})`,
                    paddingLeft:
                      hideSidebar || isMobile ? '0' : CustomSidebarWidth,
                    paddingRight:
                      isMobile || hideHeader || hideHeaderRightPadding
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
      </AuthProvider>
    </ThemeProvider>
  )
}
