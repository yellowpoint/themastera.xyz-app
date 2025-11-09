'use client'

import React from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

type AuthRequiredProps = {
  children: React.ReactNode
  protectedPrefixes?: string[]
  title?: string
  message?: string
}

export default function AuthRequired({
  children,
  protectedPrefixes = ['/creator', '/history', '/subscriptions', '/playlists'],
  title = 'Authentication Required',
  message = 'Please login to access this page',
}: AuthRequiredProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, loading } = useAuth()

  const isProtected = React.useMemo(() => {
    if (!pathname) return false
    return protectedPrefixes.some((prefix) => pathname.startsWith(prefix))
  }, [pathname, protectedPrefixes])

  if (loading) return null

  if (isProtected && !user) {
    return (
      <div className="h-full flex items-center justify-center">
        <Card className="max-w-md w-full mx-4 shadow-sm">
          <div className="text-center p-8">
            <h2 className="text-2xl font-semibold mb-3">{title}</h2>
            <p className="text-muted-foreground mb-6">{message}</p>
            <Button
              size="lg"
              onClick={() => router.push('/auth/login')}
              className="w-full"
            >
              Login / Register
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}
