'use client'

import { SidebarTrigger } from '@/components/ui/sidebar'
import { Search, LogOut } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'

export default function TopHeader() {
  const { user, signOut, loading } = useAuth()
  const router = useRouter()

  return (
    <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-divider">
      <div className="flex h-16 items-center gap-3 px-4">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
        </div>
        <div className="flex-1 flex justify-center">
          <div className="w-full max-w-md">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                aria-label="搜索"
                placeholder="搜索内容、创作者…"
                className="w-full pl-8"
              />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Badge
                className="cursor-pointer"
                onClick={() => router.push('/points')}
              >
                {user?.user_metadata?.points || 0} Points
              </Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="outline-none">
                    <Avatar className="h-8 w-8 ring-2 ring-primary">
                      <AvatarImage src={user?.user_metadata?.avatar} />
                      <AvatarFallback>
                        {user?.user_metadata?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-card">
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
                onClick={() => router.push('/auth/login')}
              >
                Login
              </Button>
              <Button
                variant="default"
                onClick={() => router.push('/auth/register')}
              >
                Register
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}