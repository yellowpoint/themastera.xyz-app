'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuth } from '@/hooks/useAuth'
import { ChevronDown, LogOut, Plus, Shield, User } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function HeaderActions({
  layout = 'row',
  className = '',
}: {
  layout?: 'row' | 'column'
  className?: string
}) {
  const { user, signOut } = useAuth()
  const router = useRouter()

  const base = layout === 'column' ? 'flex flex-col gap-2' : 'flex items-center gap-3'

  return (
    <div className={`${base} ${className}`}>
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
                  <AvatarImage src={user?.image || ''} alt={user?.name || user?.email || 'User'} />
                  <AvatarFallback>{((user?.name || user?.email || 'U')[0] || 'U').toUpperCase()}</AvatarFallback>
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
  )
}

