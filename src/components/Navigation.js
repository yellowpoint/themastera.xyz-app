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

export default function Navigation({ userProfile, isLoggedIn = false }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()

  const menuItems = [
    { name: '首页', href: '/', icon: Home },
    { name: '内容中心', href: '/content', icon: FileText },
    { name: '社区圈子', href: '/community', icon: Users },
    { name: '创作者中心', href: '/creator', icon: PenTool },
    { name: '积分商城', href: '/points', icon: ShoppingBag },
    { name: '个性化推荐', href: '/recommendations', icon: Target },
  ]

  const userMenuItems = [
    { name: '个人资料', href: '/profile', icon: User },
    { name: '我的收藏', href: '/favorites', icon: Heart },
    { name: '积分记录', href: '/points/history', icon: History },
    { name: '邀请好友', href: '/referral', icon: UserPlus },
    { name: '通知中心', href: '/notifications', icon: Bell },
    { name: '设置', href: '/settings', icon: Settings },
  ]

  return (
    <Navbar 
      onMenuOpenChange={setIsMenuOpen}
      className="bg-black/90 backdrop-blur-md border-b border-gray-800"
      maxWidth="full"
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden text-white"
        />
        <NavbarBrand>
          <Button
            variant="light"
            className="text-2xl font-bold text-white"
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
              className="text-gray-300 hover:text-lime-400 flex items-center gap-2"
              onPress={() => router.push(item.href)}
            >
              <item.icon size={16} />
              {item.name}
            </Button>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent justify="end">
        {isLoggedIn ? (
          <>
            <NavbarItem>
              <Badge content="3" color="danger" size="sm">
                <Button
                  variant="light"
                  className="text-gray-300 hover:text-lime-400"
                  onPress={() => router.push('/notifications')}
                >
                  <Bell size={20} />
                </Button>
              </Badge>
            </NavbarItem>
            
            <NavbarItem>
              <Chip 
                color="primary" 
                variant="flat"
                className="cursor-pointer"
                onClick={() => router.push('/points')}
              >
                {userProfile?.points || 0} 积分
              </Chip>
            </NavbarItem>

            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Avatar
                  isBordered
                  as="button"
                  className="transition-transform"
                  color="primary"
                  name={userProfile?.name || "用户"}
                  size="sm"
                  src={userProfile?.avatar}
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem key="profile" className="h-14 gap-2">
                  <p className="font-semibold">登录身份</p>
                  <p className="font-semibold">{userProfile?.email}</p>
                </DropdownItem>
                {userMenuItems.map((item) => (
                  <DropdownItem 
                    key={item.name}
                    onPress={() => router.push(item.href)}
                    startContent={<item.icon size={16} />}
                  >
                    {item.name}
                  </DropdownItem>
                ))}
                <DropdownItem 
                  key="logout" 
                  color="danger"
                  startContent={<LogOut size={16} />}
                >
                  退出登录
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </>
        ) : (
          <>
            <NavbarItem>
              <Button
                variant="light"
                className="text-gray-300 hover:text-lime-400"
                onPress={() => router.push('/auth/login')}
              >
                登录
              </Button>
            </NavbarItem>
            <NavbarItem>
              <Button
                color="primary"
                variant="flat"
                onPress={() => router.push('/auth/register')}
              >
                注册
              </Button>
            </NavbarItem>
          </>
        )}
      </NavbarContent>

      <NavbarMenu className="bg-black/95 backdrop-blur-md">
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item.name}-${index}`}>
            <Button
              variant="light"
              className="w-full justify-start text-gray-300 hover:text-lime-400 flex items-center gap-3"
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
        
        {isLoggedIn && (
          <>
            <NavbarMenuItem>
              <div className="w-full h-px bg-gray-700 my-2" />
            </NavbarMenuItem>
            {userMenuItems.map((item, index) => (
              <NavbarMenuItem key={`user-${item.name}-${index}`}>
                <Button
                  variant="light"
                  className="w-full justify-start text-gray-400 hover:text-lime-400 flex items-center gap-3"
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
          </>
        )}
      </NavbarMenu>
    </Navbar>
  )
}