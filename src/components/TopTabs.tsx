'use client'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from '@/components/ui/input-group'
import { Sheet, SheetContent, SheetHeader } from '@/components/ui/sheet'
import type { Work } from '@/contracts/domain/work'
import { request } from '@/lib/request'
import { Search, TextAlignStart } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import CustomSidebar from './CustomSidebar'
import { HeaderHeight } from './Header'

type TabItem = { key: string; label: string; content?: React.ReactNode }

export default function TopTabs({
  tabs,
  activeKey,
  onChange,
  className,
  contentClassName,
  keepMounted = false,
  lazyMount = true,
}: {
  tabs: TabItem[]
  activeKey: string
  onChange: (key: string) => void
  className?: string
  contentClassName?: string
  keepMounted?: boolean
  lazyMount?: boolean
}) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const itemsRef = useRef<Record<string, HTMLButtonElement | null>>({})
  const [indicatorLeft, setIndicatorLeft] = useState(0)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<Work[]>([])
  const [loadingSuggest, setLoadingSuggest] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false)
  const [mounted, setMounted] = useState<Record<string, boolean>>({
    [activeKey]: true,
  })

  const orderedKeys = useMemo(() => tabs.map((t) => t.key), [tabs])

  useEffect(() => {
    const container = containerRef.current
    const current = itemsRef.current[activeKey]
    if (!container || !current) return
    const cRect = container.getBoundingClientRect()
    const iRect = current.getBoundingClientRect()
    const width = 16
    const left = iRect.left - cRect.left + iRect.width / 2 - width / 2
    setIndicatorLeft(left)
  }, [activeKey, orderedKeys])

  useEffect(() => {
    if (keepMounted) {
      setMounted((m) => ({ ...m, [activeKey]: true }))
    }
  }, [activeKey, keepMounted])

  const handleToggleSidebar = () => {
    setSidebarOpen((prev) => !prev)
  }

  useEffect(() => {
    let ignore = false
    async function fetchSuggestions() {
      setLoadingSuggest(true)
      try {
        const params = new URLSearchParams({ page: '1', limit: '5' })
        if (query) params.set('q', query)
        const { data } = await request.get<{ items: Work[]; pagination?: any }>(
          `/api/search?${params.toString()}`
        )
        const items = ((data?.data as any)?.items || []) as Work[]
        if (!ignore) setSuggestions(items)
      } catch (_) {
      } finally {
        if (!ignore) setLoadingSuggest(false)
      }
    }
    if (searchOpen) fetchSuggestions()
    return () => {
      ignore = true
    }
  }, [searchOpen, query])

  return (
    <div>
      <div
        className={`fixed top-0 z-50 left-1/2 -translate-x-1/2  flex items-center justify-center`}
        style={{ height: HeaderHeight }}
      >
        <div
          ref={containerRef}
          className={`relative flex items-center justify-between gap-2 px-4 py-2 h-[46px] bg-overlay rounded-xl backdrop-blur ${className || ''}`}
        >
          <div className="flex items-center gap-3">
            <button
              className="md:hidden flex h-10 w-10 items-center justify-center"
              title={sidebarOpen ? 'Close Sidebar' : 'Open Sidebar'}
              type="button"
              onClick={handleToggleSidebar}
            >
              <TextAlignStart className="h-4 w-4" />
            </button>
            <div className="md:hidden flex w-[1px] items-center justify-center">
              <div className="bg-[rgba(255,255,255,0.12)] h-5 w-full" />
            </div>
            <div className="flex items-center gap-8">
              {tabs.map(({ key, label }) => (
                <div key={key} className="flex flex-col items-center">
                  <button
                    ref={(el) => {
                      itemsRef.current[key] = el
                    }}
                    className={`transition-colors duration-300 ${activeKey === key ? 'text-highlight' : 'text-muted-foreground'} text-sm font-medium`}
                    type="button"
                    onClick={() => onChange(key)}
                  >
                    {label}
                  </button>
                </div>
              ))}
              <div
                className="absolute bottom-[6px] h-1 w-4 rounded bg-primary transition-all duration-300"
                style={{ left: `${indicatorLeft}px` }}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex w-[1px] items-center justify-center ml-2">
              <div className="bg-[rgba(255,255,255,0.12)] h-5 w-full" />
            </div>
            <button
              className="flex h-10 w-10 items-center justify-center"
              title="Search"
              type="button"
              onClick={() => setSearchOpen(true)}
            >
              <div className="text-white/90 relative">
                <Search className="h-4 w-4" />
              </div>
            </button>
          </div>

          {/* Mobile Sidebar Drawer */}
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetContent
              side="left"
              className="z-[60] w-2/3 bg-[#02000233] backdrop-blur-[20px] text-white border-0 p-0 h-screen"
              hideClose
            >
              <CustomSidebar
                style={{ width: '100%' }}
                alwaysVisible
                showHeaderFooter
              />
            </SheetContent>
          </Sheet>

          <Sheet open={searchOpen} onOpenChange={setSearchOpen}>
            <SheetContent
              side="right"
              className="w-[300px] sm:max-w-md bg-[#02000233] backdrop-blur-[20px] text-white border-0"
              hideClose
            >
              <SheetHeader>
                <div className="pt-2 px-0">
                  <InputGroup className="h-12 rounded-xl bg-overlay">
                    <InputGroupAddon>
                      <InputGroupText>
                        <Search className="h-4 w-4" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <InputGroupInput
                      placeholder="Search the item you like"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                  </InputGroup>
                </div>
              </SheetHeader>

              <div className="px-4">
                <div className="mt-4">
                  {query ? null : (
                    <div className="text-sm text-muted-foreground mb-2">
                      Suggested
                    </div>
                  )}
                  <div className="space-y-3">
                    {loadingSuggest ? (
                      <div className="text-sm text-muted-foreground text-center">
                        Loading...
                      </div>
                    ) : suggestions.length ? (
                      suggestions.map((item) => (
                        <Link
                          key={item.id}
                          href={`/content/${item.id}`}
                          prefetch
                        >
                          <div className="flex items-center gap-3 hover:bg-overlay-hover rounded-md p-2">
                            <div className="w-12 h-12 rounded-md overflow-hidden shrink-0">
                              <img
                                src={
                                  item.thumbnailUrl ||
                                  '/thumbnail-placeholder.svg'
                                }
                                alt={item.title || 'Item'}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="min-w-0">
                              <div className="text-sm  truncate">
                                {item.title}
                              </div>
                              <div className="text-xs text-muted-foreground truncate">
                                {item.user?.name || 'Unknown'}
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <div className="text-sm text-muted-foreground text-center">
                        {query ? 'No results' : 'No suggestions'}
                      </div>
                    )}
                  </div>
                </div>

                {query ? null : (
                  <div className="mt-5">
                    <Link href="/explore" className="text-highlight">
                      Explore <span className="text-white">›</span>
                    </Link>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      {tabs.some((t) => t.content) && (
        <div className={contentClassName || ''}>
          {tabs.map(({ key, content }) => {
            const shouldRender = keepMounted
              ? lazyMount
                ? mounted[key]
                : true
              : activeKey === key
            if (!content) return null
            if (!shouldRender) return null
            return (
              <div key={key} hidden={activeKey !== key}>
                {content}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
