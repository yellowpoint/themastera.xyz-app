'use client'

import Header, { HeaderHeight } from '@/components/Header'
import AuthRequired from '@/components/auth-required'
import { usePathname } from 'next/navigation'
import CustomSidebar from './CustomSidebar'

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const hideHeader = ['/content', '/section', '/playlists/'].some((prefix) =>
    pathname?.startsWith(prefix)
  )
  const hideSidebar = pathname?.startsWith('/content/')
  const sidebarClass = hideHeader
    ? 'sticky top-0 h-screen overflow-y-auto'
    : `sticky top-[${HeaderHeight}] h-[calc(100vh-${HeaderHeight})] overflow-y-auto`

  return (
    <div className="flex flex-col h-screen">
      <img
        src="/bg.jpg"
        alt=""
        aria-hidden="true"
        className="fixed inset-0 w-full h-full object-cover z-0 pointer-events-none select-none"
      />
      <div className="fixed inset-0 z-0 pointer-events-none bg-black/30 backdrop-blur-md" />
      <div className="relative z-30">{!hideHeader && <Header />}</div>
      {/* border-t-4 border-l-4 border-secondary */}
      <div
        className={`relative z-20 flex-1 h-full ${!hideHeader ? 'mt-16' : 'pt-6'}`}
      >
        <div className="flex min-h-full">
          {!hideSidebar ? <CustomSidebar className={sidebarClass} /> : null}
          <div className="flex-1">
            <AuthRequired>{children}</AuthRequired>
          </div>
        </div>
      </div>
    </div>
  )
}
