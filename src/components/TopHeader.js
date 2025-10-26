'use client'

import { Input, Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Avatar, Chip } from '@heroui/react'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Search, LogOut } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'

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
            <Input
              aria-label="搜索"
              placeholder="搜索内容、创作者…"
              startContent={<Search size={16} />}
              size="sm"
              radius="sm"
              className="w-full"
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Chip
                color="primary"
                variant="flat"
                className="cursor-pointer"
                onClick={() => router.push('/points')}
              >
                {user?.user_metadata?.points || 0} Points
              </Chip>
              <Dropdown placement="bottom-end">
                <DropdownTrigger>
                  <Avatar
                    isBordered
                    as="button"
                    className="transition-transform"
                    color="primary"
                    name={user?.user_metadata?.name || user?.email?.charAt(0).toUpperCase() || 'User'}
                    size="sm"
                    src={user?.user_metadata?.avatar}
                  />
                </DropdownTrigger>
                <DropdownMenu aria-label="Profile Actions" variant="flat" className="bg-card-bg">
                  <DropdownItem key="profile" onPress={() => router.push('/profile')}>Profile</DropdownItem>
                  <DropdownItem
                    key="logout"
                    color="danger"
                    startContent={<LogOut size={16} />}
                    onPress={() => signOut({ onSuccess: () => router.push('/') })}
                  >
                    Sign Out
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </>
          ) : (
            <>
              <Button
                variant="light"
                className="text-text-secondary hover:text-primary"
                onPress={() => router.push('/auth/login')}
              >
                Login
              </Button>
              <Button
                color="primary"
                variant="flat"
                onPress={() => router.push('/auth/register')}
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