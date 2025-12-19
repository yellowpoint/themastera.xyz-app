'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Spinner } from '@/components/ui/spinner'
import { SUBSCRIPTION_LEVELS } from '@/config/subscriptions'
import { useAuth } from '@/hooks/useAuth'
import {
  ChevronDown,
  Crown,
  LogOut,
  Plus,
  Shield,
  Star,
  User,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function HeaderActions({
  layout = 'row',
  className = '',
}: {
  layout?: 'row' | 'column'
  className?: string
}) {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [isSigningOut, setIsSigningOut] = useState(false)

  const base =
    layout === 'column' ? 'flex flex-col gap-2' : 'flex items-center gap-3'

  const handleSignOut = async (e: Event) => {
    e.preventDefault()
    if (isSigningOut) return
    setIsSigningOut(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      await signOut({ onSuccess: () => router.push('/') })
    } finally {
      setIsSigningOut(false)
    }
  }

  const isPro =
    user?.stripePriceId === SUBSCRIPTION_LEVELS.PRO.priceId &&
    user?.stripeCurrentPeriodEnd &&
    new Date(user.stripeCurrentPeriodEnd) > new Date()

  const isMax =
    user?.stripePriceId === SUBSCRIPTION_LEVELS.MAX.priceId &&
    user?.stripeCurrentPeriodEnd &&
    new Date(user.stripeCurrentPeriodEnd) > new Date()

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
                <div className="relative">
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
                  {isMax && (
                    <div
                      className="absolute -bottom-1 -right-1 bg-yellow-500 rounded-full p-[2px] border-2 border-background"
                      title="Max Member"
                    >
                      <Crown className="w-3 h-3 text-white fill-white" />
                    </div>
                  )}
                  {isPro && !isMax && (
                    <div
                      className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-[2px] border-2 border-background"
                      title="Pro Member"
                    >
                      <Star className="w-3 h-3 text-white fill-white" />
                    </div>
                  )}
                </div>
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
                onClick={() => router.push('/subscriptions')}
                className=""
              >
                {isMax ? (
                  <>
                    <Crown className="mr-2 h-4 w-4 fill-yellow-500 text-yellow-500" />{' '}
                    Max Plan
                  </>
                ) : isPro ? (
                  <>
                    <Star className="mr-2 h-4 w-4 fill-blue-500 text-blue-500" />{' '}
                    Pro Plan
                  </>
                ) : (
                  <>
                    <Crown className="mr-2 h-4 w-4" /> Upgrade Plan
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={handleSignOut}
                disabled={isSigningOut}
              >
                {isSigningOut ? (
                  <Spinner className="mr-2 h-4 w-4" />
                ) : (
                  <LogOut className="mr-2 h-4 w-4" />
                )}
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      ) : (
        <>
          <Button
            variant="outline"
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
