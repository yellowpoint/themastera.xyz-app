'use client'

import { SidebarTrigger } from '@/components/ui/sidebar'
import { Search, LogOut, Bell, ChevronDown } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import Link from 'next/link'


export default function TopHeader() {
  const { user, signOut, loading } = useAuth()
  const router = useRouter()

  return (
    <div className="light fixed left-0 right-0 top-0 z-40 border-b border-divider bg-background text-foreground">
      <div className="flex h-16 items-center gap-3 px-4">
        <div className="flex items-center justify-between w-60">
          <Link
            href="/"
            className="flex items-center gap-2 group-data-[collapsible=icon]/sidebar-wrapper:hidden"
          >
            <img src="/logo-black.png" alt="Logo" className="h-auto w-15" />
            <span>THE MASTERA</span>
          </Link>
          <SidebarTrigger />
        </div>
        <div className="flex-1 flex justify-center">
          <div className="w-full max-w-md">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                aria-label="Search"
                placeholder="Search the item you like"
                className="w-full pl-8"
              />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Button
                variant="secondary"
                onClick={() => router.push('/creator')}
              >
                <span className="text-lg">+</span> Create
              </Button>
              {/* Notifications bell */}
              <Button
                variant="ghost"
                size="icon"
                aria-label="Notifications"
                className="text-muted-foreground hover:text-foreground"
              >
                <Bell className="h-5 w-5" />
              </Button>
              {/* Greeting with dropdown */}
              <DropdownMenu >
                <DropdownMenuTrigger asChild>
                  <button className="outline-none flex items-center gap-2">
                    <span className="text-sm">{`Hi, ${user?.name || user?.email || 'User'}`}</span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className='bg-card light'>
                  <DropdownMenuItem onClick={() => router.push('/profile')}>Profile</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => signOut({ onSuccess: () => router.push('/') })}>
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
              <Button
                onClick={() => router.push('/auth/login')}
              >
                Login
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}