'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ENABLE_BETA_CHECK } from '@/config/beta'
import { useAuth } from '@/hooks/useAuth'
import { isBetaVerified } from '@/utils/beta'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'

type AuthRequiredProps = {
  children: React.ReactNode
  protectedPrefixes?: string[]
  title?: string
  message?: string
  enabled?: boolean
}

export default function AuthRequired({
  children,
  protectedPrefixes = ['/creator', '/history', '/subscriptions', '/admin'],
  title = 'Authentication Required',
  message = 'Please login to access this page',
  enabled,
}: AuthRequiredProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, loading } = useAuth()

  const betaVerified = isBetaVerified()

  React.useEffect(() => {
    if (!loading && ENABLE_BETA_CHECK) {
      if (!user && !betaVerified) {
        if (pathname !== '/beta-notice' && !pathname?.startsWith('/auth/')) {
          router.replace('/beta-notice')
        }
      }
    }
  }, [loading, user, router, pathname, betaVerified])

  const isProtected = React.useMemo(() => {
    if (enabled === true) return true
    if (!pathname) return false
    return protectedPrefixes.some((prefix) => pathname.startsWith(prefix))
  }, [pathname, protectedPrefixes, enabled])

  if (loading) return null

  if (
    ENABLE_BETA_CHECK &&
    !user &&
    !betaVerified &&
    pathname !== '/beta-notice' &&
    !pathname?.startsWith('/auth/')
  )
    return null

  if (isProtected && !user) {
    return (
      <div className="h-[calc(100vh-160px)] flex items-center justify-center">
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
