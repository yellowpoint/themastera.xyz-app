'use client'

import {
  AudioWaveform,
  Bot,
  Command,
  Frame,
  Home,
  PieChart,
  Settings2,
} from 'lucide-react'
import * as React from 'react'

import { NavMain } from '@/components/nav-main'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar'
import { useAuth } from '@/hooks/useAuth'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

// This is sample data.
const data = {
  navMain: [
    { title: 'Home', url: '/', icon: Home },
    { title: 'Explore', url: '/explore', icon: Command },
  ],
  navMain2: [
    // { title: 'Subscriptions', url: '/subscriptions', icon: BookOpen },
    { title: 'Playlists', url: '/playlists', icon: AudioWaveform },
    // { title: 'History', url: '/history', icon: History },
  ],
  navMain3: [{ title: 'Dashboard', url: '/creator', icon: PieChart }],
  admin: [{ title: 'Admin', url: '/admin', icon: Bot }],
  footer: [
    { title: 'Settings', url: '/settings', icon: Settings2 },
    { title: 'Report history', url: '/report-history', icon: Frame },
  ],
}

function SidebarContentWithState() {
  const { state } = useSidebar()
  const { user } = useAuth()
  const isAdmin = !!user && user.level === 'Admin'

  return (
    <SidebarContent className="pt-18">
      <NavMain items={data.navMain} title="" />
      <NavMain items={data.navMain2} title="You" />
      <NavMain items={data.navMain3} title="Creator +" />
      {isAdmin && <NavMain items={data.admin} title="Admin" />}
      {/* <NavMain items={data.navMain3} title="Community" /> */}
      {/* Playlist section moved to Content detail page */}
    </SidebarContent>
  )
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const hideSidebar = pathname?.startsWith('/content/')
  if (hideSidebar) return null
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {/* <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 group-data-[collapsible=icon]:hidden"
          >
            <img src="/logo.svg" alt="Logo" className="h-6 w-6" />
            <span className="font-semibold">TheMasterA</span>
          </Link>
          <SidebarTrigger />
        </div> */}
      </SidebarHeader>
      <SidebarContentWithState />
      <SidebarFooter>
        {/* Links: Privacy + Terms (small, gray, bottom) */}
        <div className="px-3 py-3 text-xs text-muted-foreground group-data-[state=collapsed]:hidden">
          <div className="space-y-1">
            <Link
              href="/privacy-policy"
              className="block opacity-70 hover:opacity-100 transition-opacity"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-of-service"
              className="block opacity-70 hover:opacity-100 transition-opacity"
            >
              Terms of Service
            </Link>
          </div>
        </div>
        {/* <NavMain items={data.footer} /> */}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
