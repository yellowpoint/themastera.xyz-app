'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { useAuth } from '@/hooks/useAuth'
import { Calendar, ListVideo, Sparkles, User } from 'lucide-react'
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
    {
      title: 'Beta',
      href: '/admin/beta-applications',
      icon: Sparkles,
    },
    { title: 'Users', href: '/admin/users', icon: User },
    { title: 'Works', href: '/admin/works', icon: ListVideo },
    { title: 'Quick Picks', href: '/admin/quick-picks', icon: Sparkles },
    {
      title: 'Events',
      href: '/admin/events',
      icon: Calendar,
    },
  ]

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" className="top-[80px]">
        <SidebarHeader>
          <SidebarTrigger className="ml-auto" />
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => {
                  const Icon = item.icon
                  const active =
                    pathname === item.href ||
                    (pathname || '').startsWith(item.href + '/')
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={active}>
                        <Link href={item.href}>
                          <Icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <div className="p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
