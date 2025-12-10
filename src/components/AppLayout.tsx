'use client'

import Header, { HeaderHeight } from '@/components/Header'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { useIsMobile } from '@/hooks/use-mobile'
import { AuthProvider } from '@/hooks/useAuth'
import { usePathname } from 'next/navigation'
import BackgroundSwitcher from './BackgroundSwitcher'
import CustomSidebar, { CustomSidebarWidth, sidebarUrls } from './CustomSidebar'
import AuthRequired from './auth-required'

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isMobile = useIsMobile()

  // 工具方法（组件内部）：基于当前路径进行前缀匹配；根路径'/'使用全等判断
  const startsWithAny = (prefixes: string[]): boolean => {
    if (!pathname) return undefined
    return prefixes.some((p) =>
      p === '/' ? pathname === '/' : pathname.startsWith(p)
    )
  }

  // 主题：在指定前缀路由下强制使用浅色主题
  const isLight = startsWithAny(['/creator', '/admin'])

  // 是否强制隐藏 Header（例如公告页）
  const hideHeader = startsWithAny(['/beta-notice'])

  // 是否隐藏侧边栏（在某些路由或移动端）
  const hideSidebar = startsWithAny([
    '/content',
    '/user',
    '/beta-notice',
    '/auth',
    '/admin',
    '/creator',
    '/event/',
  ])

  // 是否在Header展示返回按钮
  const showHeaderBack =
    startsWithAny(['/event/', '/playlists/']) ||
    !startsWithAny([...sidebarUrls, '/auth'])

  // 是否显示背景图
  const showBackgroundImage =
    !isMobile &&
    startsWithAny([...sidebarUrls, '/auth', '/profile', '/section'])

  // 通用内容容器样式：根据是否隐藏 Header 设置上内边距
  const contentContainerStyle = {
    paddingTop: hideHeader ? '0' : HeaderHeight,
  }

  // PC 端布局：包含可选的侧边栏与内容区域的左右间距
  const renderDesktopLayout = () => {
    // 是否隐藏右侧填充（让内容区域更宽）
    const hideHeaderRightPadding = startsWithAny([
      '/content',
      '/creator',
      '/user',
      '/auth',
    ])

    // 侧边栏样式：根据 Header 是否隐藏决定位置与高度
    const sidebarStyle = {
      top: hideHeader ? '0' : HeaderHeight,
    }
    return (
      <>
        {!hideHeader && <Header showBack={showHeaderBack} />}
        {!hideSidebar && <CustomSidebar style={sidebarStyle} />}
        <main
          className="h-full"
          style={{
            paddingTop: hideHeader ? '0' : HeaderHeight,
            paddingLeft: hideSidebar ? '0' : CustomSidebarWidth,
            paddingRight:
              hideHeader || hideHeaderRightPadding ? '0' : CustomSidebarWidth,
          }}
        >
          {children}
        </main>
      </>
    )
  }

  // 移动端布局：不渲染侧边栏，内容区域左右不留空白
  const renderMobileLayout = () => {
    const hasTopTabs = ['/', '/event', '/explore', '/playlists']
    const mobileHideHeader = hideHeader || hasTopTabs.includes(pathname)
    // 移动端侧边栏控制器：sidebarUrls 排除 hasTopTabs，再加上 '/auth', '/admin'
    const showSidebarController = startsWithAny([
      ...sidebarUrls.filter((u) => !hasTopTabs.includes(u)),
      '/auth',
      '/admin',
    ])

    return (
      <>
        {!mobileHideHeader && (
          <Header
            showSidebarController={showSidebarController}
            showLogo={!showSidebarController}
            showBack={showHeaderBack}
          />
        )}
        <main
          className="h-full"
          style={{
            paddingTop: hideHeader ? '0' : HeaderHeight,
          }}
        >
          {children}
        </main>
      </>
    )
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      forcedTheme={isLight ? 'light' : 'dark'}
      enableSystem={false}
    >
      <AuthProvider>
        <Toaster position="top-center" />
        <AuthRequired>
          <div className="flex flex-col h-screen overflow-hidden">
            {showBackgroundImage && <BackgroundSwitcher />}
            <div className={`relative z-20 flex-1 h-full overflow-y-auto`}>
              {isMobile ? renderMobileLayout() : renderDesktopLayout()}
            </div>
          </div>
        </AuthRequired>
      </AuthProvider>
    </ThemeProvider>
  )
}
