'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { useAuth } from '@/hooks/useAuth'
import { ChevronDown, LogOut, Plus, User } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Header() {
  const { user, signOut, loading } = useAuth()
  const router = useRouter()

  return (
    <>
      <div className="fixed left-0 top-0 z-40">
        <div className="flex h-[80px] items-center gap-3 pl-4">
          <Link
            href="/"
            className="flex items-center gap-2 group-data-[collapsible=icon]/sidebar-wrapper:hidden"
          >
            <img
              src="/logo-black.png"
              alt="Logo"
              className="h-auto w-15 dark:hidden"
            />
            <img
              src="/logo-white.png"
              alt="Logo"
              className="h-auto w-15 hidden dark:block"
            />
          </Link>
          <SidebarTrigger className="md:hidden" />
        </div>
      </div>
      <div className="fixed right-0 top-0 z-40">
        <div className="flex h-[80px] items-center gap-3 pr-4">
          {user ? (
            <>
              <Button
                onClick={() => router.push('/creator/upload')}
                variant="secondary"
                size="sm"
                className="bg-[#F6F9FC1A] hover:bg-[#FFFFFF44]  text-sm"
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
                <DropdownMenuContent align="end" className="bg-card">
                  <DropdownMenuItem onClick={() => router.push('/profile')}>
                    <User className="mr-2 h-4 w-4" /> Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      signOut({ onSuccess: () => router.push('/') })
                    }
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
      </div>
    </>
  )
}
