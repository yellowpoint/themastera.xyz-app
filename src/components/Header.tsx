'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useAuth } from '@/hooks/useAuth'
import {
  ChevronDown,
  LogOut,
  Plus,
  Shield,
  TextAlignStart,
  User,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import BackButton from './BackButton'
import CustomSidebar, { CustomSidebarWidth } from './CustomSidebar'

export const HeaderHeight = '80px'

export default function Header({
  showBackButton = false,
  showLogo = true,
}: {
  showBackButton?: boolean
  showLogo?: boolean
}) {
  const { user, signOut, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const isDetailPage = pathname?.startsWith('/content/')

  return (
    <>
      <div
        className={`fixed left-0 top-0 z-40 flex items-center gap-3 pl-8`}
        style={{ height: HeaderHeight, width: CustomSidebarWidth }}
      >
        {showBackButton ? <BackButton className="" /> : null}
        {isDetailPage ? (
          <Sheet>
            <SheetTrigger asChild>
              <button
                className="flex h-10 items-center justify-center"
                title="Open Sidebar"
                type="button"
                aria-label="Open Sidebar"
              >
                <div className="text-white/90 relative">
                  <TextAlignStart className="h-4 w-4" />
                </div>
              </button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-[160px] sm:max-w-md bg-[#02000233] backdrop-blur-[20px] text-white border-0 p-0 h-screen"
              hideClose
            >
              <CustomSidebar style={{ width: '100%' }} alwaysVisible />
            </SheetContent>
          </Sheet>
        ) : null}
        {showLogo ? (
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
            {/* <span className="text-xl">MASTERA</span> */}
          </Link>
        ) : null}
      </div>

      <div
        className={`fixed right-0 top-0 z-40 flex items-center gap-3 pr-4`}
        style={{ height: HeaderHeight }}
      >
        {user ? (
          <>
            <Button
              onClick={() => router.push('/creator')}
              variant="secondary"
              size="sm"
              className="bg-overlay hover:bg-overlay-hover text-foreground text-sm"
            >
              <Plus className="size-4" />
              Create
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="outline-none flex items-center gap-2">
                  <Avatar>
                    <AvatarImage
                      src={user?.image || ''}
                      alt={user?.name || user?.email || 'User'}
                    />
                    <AvatarFallback>
                      {(
                        (user?.name || user?.email || 'U')[0] || 'U'
                      ).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {user?.level === 'Admin' ? (
                  <DropdownMenuItem onClick={() => router.push('/admin')}>
                    <Shield className="mr-2 h-4 w-4" /> Admin
                  </DropdownMenuItem>
                ) : null}
                <DropdownMenuItem onClick={() => router.push('/profile')}>
                  <User className="mr-2 h-4 w-4" /> Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => signOut({ onSuccess: () => router.push('/') })}
                >
                  <LogOut className="mr-2 h-4 w-4" /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <>
            <Button
              variant="ghost"
              className="text-muted-foreground hover:text-foreground"
              onClick={() => router.push('/auth/register')}
            >
              Sign up
            </Button>
            <Button onClick={() => router.push('/auth/login')}>Login</Button>
          </>
        )}
      </div>
    </>
  )
}
