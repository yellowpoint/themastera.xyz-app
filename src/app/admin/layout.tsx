'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useAuth } from '@/hooks/useAuth'
import { ListVideo, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, loading } = useAuth()

  if (loading) return null

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

  const navItems = [
    { title: 'Works', href: '/admin/works', icon: ListVideo },
    { title: 'Quick Picks', href: '/admin/quick-picks', icon: Sparkles },
    {
      title: 'Beta',
      href: '/admin/beta-applications',
      icon: Sparkles,
    },
  ]

  return (
    <div className="flex min-h-screen">
      <aside className="fixed top-[80px] bottom-0 inset-y-0 left-0 w-[160px] border-r p-3 overflow-y-auto">
        <nav>
          <ul className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const active =
                pathname === item.href ||
                (pathname || '').startsWith(item.href + '/')
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-2 px-2 py-2 rounded-md ${
                      active
                        ? 'bg-overlay text-highlight'
                        : 'text-foreground/80 hover:text-foreground hover:bg-overlay'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm">{item.title}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </aside>
      <div className="flex-1 p-6 ml-[160px]">{children}</div>
    </div>
  )
}
