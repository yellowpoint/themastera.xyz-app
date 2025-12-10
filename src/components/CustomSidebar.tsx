'use client'

import { useIsMobile } from '@/hooks/use-mobile'
import { motion } from 'framer-motion'
import {
  Flag,
  Home,
  Linkedin,
  ListVideo,
  ShoppingCart,
  Telescope,
  Ticket,
  Trophy,
  Twitter,
  Youtube,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import HeaderActions from './HeaderActions'

type NavItem = {
  title: string
  url: string
  icon: React.ComponentType<{ className?: string }>
  match?: (path: string) => boolean
}
export const CustomSidebarWidth = '160px'
const items: NavItem[] = [
  { title: 'Home', url: '/', icon: Home },
  { title: 'Explore', url: '/explore', icon: Telescope },
  { title: 'Playlist', url: '/playlists', icon: ListVideo },
  { title: 'Ranking', url: '/ranking', icon: Trophy },
  { title: 'Event', url: '/event', icon: Flag },
  { title: 'Shop', url: '/shop', icon: ShoppingCart },
  { title: 'Treasures', url: '/treasures', icon: Ticket },
  // { title: 'Creator', url: '/creator', icon: BadgePlus },
  // { title: 'Admin', url: '/admin', icon: Settings },
]
const footerItems = [
  { title: 'Privacy', url: '/privacy-policy' },
  { title: 'Terms', url: '/terms-of-service' },
]
// 侧边栏所有 URL 列表
export const sidebarUrls = [
  ...items.map((item) => item.url),
  ...footerItems.map((item) => item.url),
]

export default function CustomSidebar({
  style = {},
  alwaysVisible = false,
  showHeaderFooter = false,
}: {
  style?: React.CSSProperties
  alwaysVisible?: boolean
  showHeaderFooter?: boolean
}) {
  const pathname = usePathname()
  const hideSidebar = pathname?.startsWith('/content/')
  const isMobile = useIsMobile()
  if (hideSidebar && !alwaysVisible) return null

  return (
    <aside
      className={`fixed top-0 left-0 flex flex-col ${showHeaderFooter ? 'justify-between' : 'justify-center'} items-center h-full`}
      style={{ width: CustomSidebarWidth, ...style }}
    >
      {showHeaderFooter ? (
        <div className="w-full pl-8 pt-6">
          <Link
            href="/"
            aria-label="Home"
            className="flex items-baseline gap-2"
          >
            <img
              src="/logo/Vertical.svg"
              alt="Logo"
              className="h-auto w-14 dark:invert"
            />
          </Link>
        </div>
      ) : null}
      <nav className=" pl-6 pb-20 flex-1 w-full flex flex-col items-center justify-center ">
        <ul className="space-y-4 w-full">
          {items.map((item) => {
            const Icon = item.icon
            const isActive = item.match
              ? item.match(pathname || '')
              : pathname === item.url ||
                (item.url !== '/' && (pathname || '').startsWith(item.url))
            return (
              <li key={item.title} className="relative h-10 w-full">
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active-indicator"
                    className="absolute z-1 inset-0 rounded bg-overlay "
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <Link
                  href={item.url}
                  className={
                    'relative z-2 flex items-center px-3 gap-2 w-full h-full'
                  }
                >
                  <Icon className="size-5 text-foreground" />
                  <span
                    className={
                      'text-sm font-medium' +
                      (isActive
                        ? ' text-highlight'
                        : ' text-muted-foreground hover:text-foreground/80')
                    }
                  >
                    {item.title}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="w-full pl-6 pb-6 text-muted-foreground">
        {isMobile && showHeaderFooter ? (
          <div className="mb-3 flex items-center justify-between pr-4">
            <HeaderActions />
          </div>
        ) : null}
        <div className="flex items-center gap-4 mb-3">
          {[
            {
              href: 'https://www.linkedin.com/',
              icon: Linkedin,
              label: 'LinkedIn',
            },
            { href: 'https://twitter.com/', icon: Twitter, label: 'Twitter' },
            {
              href: 'https://www.youtube.com/',
              icon: Youtube,
              label: 'YouTube',
            },
          ].map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-80 hover:opacity-100"
              aria-label={label}
            >
              <Icon className="size-4" />
            </Link>
          ))}
        </div>
        <div className="space-y-1 text-sm">
          {footerItems.map((i) => (
            <Link
              key={i.url}
              href={i.url}
              className="block opacity-80 hover:opacity-100"
            >
              {i.title}
            </Link>
          ))}
        </div>
      </div>
    </aside>
  )
}
