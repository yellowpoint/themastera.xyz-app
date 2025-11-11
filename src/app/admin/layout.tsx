'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import React from 'react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { user, loading } = useAuth()

  if (loading) return null

  // Logged in but not admin → show forbidden message
  const level = (user as any)?.level
  if (level !== 'Admin') {
    return (
      <div className="h-full flex items-center justify-center">
        <Card className="max-w-md w-full mx-4 shadow-sm">
          <div className="text-center p-8">
            <h2 className="text-2xl font-semibold mb-3">Access Denied</h2>
            <p className="text-muted-foreground mb-6">
              Admin permissions required. If you believe this is a mistake,
              contact support.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" onClick={() => router.push('/')}>
                Back to Home
              </Button>
              <Button onClick={() => router.push('/profile')}>
                Go to Profile
              </Button>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}
