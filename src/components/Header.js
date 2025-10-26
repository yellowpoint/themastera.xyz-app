'use client'

import { useState } from 'react'
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
  Chip,
  Badge
} from '@heroui/react'
import { useRouter } from 'next/navigation'
import {
  Bell,
  Home,
  FileText,
  Users,
  PenTool,
  ShoppingBag,
  Target,
  User,
  Heart,
  History,
  UserPlus,
  Settings,
  LogOut
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()
  const { user, signOut, loading } = useAuth()

  const menuItems = [
    { name: 'Home', href: '/', icon: Home },
    // { name: 'Content Center', href: '/content', icon: FileText },
    // { name: 'Community', href: '/community', icon: Users },
    { name: 'Creator Center', href: '/creator', icon: PenTool },
    // { name: 'Points Store', href: '/points', icon: ShoppingBag },
    // { name: 'Recommendations', href: '/recommendations', icon: Target },
  ]

  const userMenuItems = [
    { name: 'Profile', href: '/profile', icon: User },
    { name: 'My Favorites', href: '/favorites', icon: Heart },
    { name: 'Points History', href: '/points/history', icon: History },
    { name: 'Invite Friends', href: '/referral', icon: UserPlus },
    { name: 'Notifications', href: '/notifications', icon: Bell },
    { name: 'Settings', href: '/settings', icon: Settings },
  ]

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <Navbar className="backdrop-blur-md border-b border-gray-800" maxWidth="full">
        <NavbarContent>
          <NavbarBrand>
            <Button
              variant="light"
              className="text-2xl font-bold"
              onPress={() => router.push('/')}
            >
              Mastera
            </Button>
          </NavbarBrand>
        </NavbarContent>
      </Navbar>
    )
  }

  return (
    <>
      <Navbar
        onMenuOpenChange={setIsMenuOpen}
        className="bg-background border-b border-divider shadow-sm"
        maxWidth="full"
      >
        <NavbarContent>
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="sm:hidden text-text-primary"
          />
          <NavbarBrand>
            <Button
              variant="light"
              className="text-2xl font-bold text-text-primary"
              onPress={() => router.push('/')}
            >
              Mastera
            </Button>
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          {menuItems.map((item) => (
            <NavbarItem key={item.name}>
              <Button
                variant="light"
                className="text-text-secondary hover:text-primary flex items-center gap-2"
                onPress={() => router.push(item.href)}
              >
                <item.icon size={16} />
                {item.name}
              </Button>
            </NavbarItem>
          ))}
        </NavbarContent>

        <NavbarContent justify="end">
          {user ? (
            <>
              <NavbarItem>
                <Button
                  variant="light"
                  size="sm"
                  className="text-text-secondary hover:text-primary"
                  onPress={() => router.push('/notifications')}
                >
                  <Badge content="25" color="danger" size="sm">
                    <Bell size={20} />
                  </Badge>
                </Button>
              </NavbarItem>

              <NavbarItem>
                <Chip
                  color="primary"
                  variant="flat"
                  className="cursor-pointer"
                  onClick={() => router.push('/points')}
                >
                  {user?.user_metadata?.points || 0} Points
                </Chip>
              </NavbarItem>

              <Dropdown placement="bottom-end">
                <DropdownTrigger>
                  <Avatar
                    isBordered
                    as="button"
                    className="transition-transform"
                    color="primary"
                    name={user?.user_metadata?.name || user?.email?.charAt(0).toUpperCase() || "User"}
                    size="sm"
                    src={user?.user_metadata?.avatar}
                  />
                </DropdownTrigger>
                <DropdownMenu aria-label="Profile Actions" variant="flat" className="bg-card-bg">
                  <DropdownItem key="profile" className="h-14 gap-2">
                    <p className="font-semibold">Logged in as</p>
                    <p className="font-semibold">{user?.email}</p>
                  </DropdownItem>
                  {userMenuItems.map((item) => (
                    <DropdownItem
                      key={item.name}
                      onPress={() => router.push(item.href)}
                      startContent={<item.icon size={16} className="text-text-secondary" />}
                      className="text-text-primary"
                    >
                      {item.name}
                    </DropdownItem>
                  ))}
                  <DropdownItem
                    key="logout"
                    color="danger"
                    startContent={<LogOut size={16} />}
                    onPress={handleSignOut}
                  >
                    Sign Out
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </>
          ) : (
            <>
              <NavbarItem>
                <Button
                  variant="light"
                  className="text-text-secondary hover:text-primary"
                  onPress={() => router.push('/auth/login')}
                >
                  Login
                </Button>
              </NavbarItem>
              <NavbarItem>
                <Button
                  color="primary"
                  variant="flat"
                  onPress={() => router.push('/auth/register')}
                >
                  Register
                </Button>
              </NavbarItem>
            </>
          )}
        </NavbarContent>

        <NavbarMenu className="bg-background border-r border-divider">
          {menuItems.map((item, index) => (
            <NavbarMenuItem key={`${item.name}-${index}`}>
              <Button
                variant="light"
                className="w-full justify-start text-text-secondary hover:text-primary flex items-center gap-3"
                onPress={() => {
                  router.push(item.href)
                  setIsMenuOpen(false)
                }}
              >
                <item.icon size={18} />
                {item.name}
              </Button>
            </NavbarMenuItem>
          ))}

          {user && (
            <>
              <NavbarMenuItem>
                <div className="w-full h-px bg-divider my-2" />
              </NavbarMenuItem>
              {userMenuItems.map((item, index) => (
                <NavbarMenuItem key={`user-${item.name}-${index}`}>
                  <Button
                    variant="light"
                    className="w-full justify-start text-text-secondary hover:text-primary flex items-center gap-3"
                    onPress={() => {
                      router.push(item.href)
                      setIsMenuOpen(false)
                    }}
                  >
                    <item.icon size={18} />
                    {item.name}
                  </Button>
                </NavbarMenuItem>
              ))}
              <NavbarMenuItem>
                <Button
                  variant="light"
                  className="w-full justify-start text-red-400 hover:text-red-300 flex items-center gap-3"
                  onPress={() => {
                    handleSignOut()
                    setIsMenuOpen(false)
                  }}
                >
                  <LogOut size={18} />
                  Sign Out
                </Button>
              </NavbarMenuItem>
            </>
          )}

          {!user && (
            <>
              <NavbarMenuItem>
                <div className="w-full h-px bg-divider my-2" />
              </NavbarMenuItem>
              <NavbarMenuItem>
                <Button
                  variant="light"
                  className="w-full justify-start text-text-secondary hover:text-primary"
                  onPress={() => {
                    router.push('/auth/login')
                    setIsMenuOpen(false)
                  }}
                >
                  Login
                </Button>
              </NavbarMenuItem>
              <NavbarMenuItem>
                <Button
                  variant="light"
                  className="w-full justify-start text-text-secondary hover:text-primary"
                  onPress={() => {
                    router.push('/auth/register')
                    setIsMenuOpen(false)
                  }}
                >
                  Register
                </Button>
              </NavbarMenuItem>
            </>
          )}


        </NavbarMenu>
      </Navbar>
    </>
  )
}