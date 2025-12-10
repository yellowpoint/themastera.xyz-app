'use client'

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useIsMobile } from '@/hooks/use-mobile'
import { useAuth } from '@/hooks/useAuth'
import { TextAlignStart } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import BackButton from './BackButton'
import CustomSidebar, { CustomSidebarWidth } from './CustomSidebar'
import HeaderActions from './HeaderActions'

export const HeaderHeight = '80px'

export default function Header({
  showLogo = true,
  showBack = false,
  showSidebarController = false,
}: {
  showLogo?: boolean
  showBack?: boolean
  showSidebarController?: boolean
}) {
  const { user, signOut, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const isDetailPage = pathname?.startsWith('/content/')
  const isMobile = useIsMobile()
  const [sheetOpen, setSheetOpen] = useState(false)

  useEffect(() => {
    if (isMobile) setSheetOpen(false)
  }, [pathname, isMobile])

  return (
    <>
      <div
        className="md:hidden w-full fixed left-0 top-0 z-40 bg-[#02000233] backdrop-blur-[20px]"
        style={{ height: HeaderHeight }}
      ></div>
      <div
        className={`fixed left-0 top-0 z-40 flex items-center gap-3 pl-4 md:pl-8`}
        style={{
          height: HeaderHeight,
          width: CustomSidebarWidth,
        }}
      >
        {showBack ? (
          <BackButton />
        ) : (
          showLogo && (
            <Link
              href="/"
              className="flex items-baseline gap-2 group-data-[collapsible=icon]/sidebar-wrapper:hidden"
              aria-label="Home"
            >
              <img
                src="/logo/Vertical.svg"
                alt="Logo"
                className="h-auto w-14 dark:invert"
              />
            </Link>
          )
        )}
        {(showSidebarController || isDetailPage) && (
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <button
                className="flex h-10 items-center justify-center"
                title="Open Sidebar"
                type="button"
                aria-label="Open Sidebar"
              >
                <div className="text-white/90 relative">
                  <TextAlignStart className="size-5" />
                </div>
              </button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-2/3 md:w-[160px] bg-[#02000233] backdrop-blur-[20px] text-white border-0 p-0 h-screen"
              hideClose
            >
              <CustomSidebar
                style={{ width: '100%' }}
                alwaysVisible
                showHeaderFooter
              />
            </SheetContent>
          </Sheet>
        )}
      </div>

      <div
        className={`fixed right-0 top-0 z-40 flex items-center gap-3 pr-4`}
        style={{ height: HeaderHeight }}
      >
        <HeaderActions />
      </div>
    </>
  )
}
