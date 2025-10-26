'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@heroui/react'
import {
  Home,
  PenTool,
  FileText,
  BarChart2,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import Link from 'next/link'

export default function Sidebar() {
  const router = useRouter()
  const { user } = useAuth()
  const [collapsed, setCollapsed] = useState(false)

  const menuItems = [
    { name: 'My Profile', href: '/profile', icon: Home },
    { name: 'Content', href: '/content', icon: FileText },
    { name: 'Analysis', href: '/analysis', icon: BarChart2 },
    { name: 'Articles', href: '/articles', icon: PenTool },
    { name: 'Points & Rewards', href: '/rewards', icon: Users },
    { name: 'Broadcast', href: '/broadcast', icon: Users },
  ]

  return (
    <div className={`${collapsed ? 'w-16' : 'w-64'} h-full bg-background border-r border-divider flex flex-col transition-width duration-300`}>
      <div className="p-4 relative">
        <div className="flex items-center mb-6">
          {!collapsed && (
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary"></div>
              <span className="text-xl font-bold text-primary">Mastera</span>
            </Link>
          )}
          {collapsed && (
            <Link href="/" className="flex justify-center">
              <div className="w-8 h-8 bg-primary"></div>
            </Link>
          )}
        </div>
        <Button
          isIconOnly
          variant="light"
          className="text-text-secondary hover:text-primary absolute -right-5 top-4 z-9999 bg-background border border-divider rounded-full shadow-sm flex items-center justify-center size-10"
          onPress={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>

        <div className="space-y-1">
          {menuItems.map((item) => (
            <Button
              key={item.href}
              variant="light"
              className={`w-full ${collapsed ? 'justify-center px-1' : 'justify-start px-3'} text-text-secondary hover:text-primary hover:bg-primary/5 py-2.5 rounded-lg`}
              isIconOnly={collapsed}
              startContent={!collapsed && <item.icon size={18} />}
              onPress={() => router.push(item.href)}
            >
              {collapsed ? <item.icon size={18} /> : item.name}
            </Button>
          ))}
        </div>
      </div>

      <div className="mt-auto p-4 border-t border-divider">
        <Button
          variant="light"
          className={`w-full ${collapsed ? 'justify-center px-1' : 'justify-start px-3'} text-text-secondary hover:text-primary hover:bg-primary/5 py-2.5 rounded-lg`}
          startContent={!collapsed && <Settings size={18} />}
          isIconOnly={collapsed}
          onPress={() => router.push('/settings')}
        >
          {collapsed ? <Settings size={18} /> : 'Settings'}
        </Button>
      </div>
    </div>
  )
}