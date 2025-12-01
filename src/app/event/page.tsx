'use client'

import SortSearchToolbar from '@/components/SortSearchToolbar'
import TopTabs from '@/components/TopTabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from '@/components/ui/pagination'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { request } from '@/lib/request'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

// --- Types ---
interface EventItem {
  id: string
  title: string
  dateRange: string
  status: 'Upcoming' | 'On viewing' | 'Ended'
  imageUrl: string
  artist: {
    name: string
    avatarUrl: string
  }
}

const TABS = [
  { key: 'on-viewing', label: 'On viewing' },
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'archive', label: 'Archive' },
]

export default function EventPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('upcoming')
  const [itemsPerPage, setItemsPerPage] = useState('5')
  const [currentPage, setCurrentPage] = useState(1)
  const [events, setEvents] = useState<EventItem[]>([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)

  // Map tab key to status
  const statusMap: Record<string, string> = {
    'on-viewing': 'On viewing',
    upcoming: 'Upcoming',
    archive: 'Ended',
  }

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (searchQuery) params.set('q', searchQuery)

        const status = statusMap[activeTab]
        if (status) params.set('status', status)

        params.set('page', String(currentPage))
        params.set('limit', itemsPerPage)

        const { data } = await request.get(`/api/events?${params.toString()}`)
        if (data?.success) {
          const mappedEvents = (data.data.items || []).map((item: any) => ({
            id: item.id,
            title: item.title,
            dateRange: item.period || '',
            status: item.status,
            imageUrl: item.posterUrl || '/bg/1.jpg',
            artist: {
              name: item.artistName || 'Unknown Artist',
              avatarUrl: item.artistAvatar || '',
            },
          }))
          setEvents(mappedEvents)
          setTotal(data.data.pagination?.total || 0)
        }
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    // Debounce search slightly
    const timer = setTimeout(() => {
      fetchEvents()
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery, activeTab, itemsPerPage, currentPage])

  const totalPages = Math.ceil(total / parseInt(itemsPerPage))

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <TopTabs tabs={TABS} activeKey={activeTab} onChange={setActiveTab} />

      {/* Main Content */}
      <main className="flex-1 p-6 space-y-6 container mx-auto max-w-7xl">
        <h1 className="text-4xl">Event</h1>
        <SortSearchToolbar
          showSortButtons={false}
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          searchPlaceholder="Search event name"
        />

        {/* Events Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {events.length > 0 ? (
              events.map((event) => <EventCard key={event.id} event={event} />)
            ) : (
              <div className="col-span-full text-center py-10 text-muted-foreground">
                No events found
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        {total > 0 && (
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 pb-4 text-sm text-muted-foreground">
            <div>Total {total} items</div>

            <div className="flex items-center gap-6">
              <Pagination className="w-auto mx-0">
                <PaginationContent>
                  <PaginationItem>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      disabled={currentPage <= 1}
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                  </PaginationItem>
                  {/* Simplified pagination logic */}
                  {Array.from({ length: Math.min(5, totalPages) }).map(
                    (_, i) => {
                      // Show pages around current page
                      let p = i + 1
                      if (totalPages > 5) {
                        if (currentPage > 3) p = currentPage - 2 + i
                        if (p > totalPages) p = totalPages - (4 - i)
                      }
                      return (
                        <PaginationItem key={p}>
                          <PaginationLink
                            isActive={currentPage === p}
                            onClick={() => setCurrentPage(p)}
                            className={cn(
                              'h-8 w-8 cursor-pointer',
                              currentPage === p &&
                                'bg-primary text-primary-foreground hover:bg-primary/90'
                            )}
                          >
                            {p}
                          </PaginationLink>
                        </PaginationItem>
                      )
                    }
                  )}
                  <PaginationItem>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      disabled={currentPage >= totalPages}
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>

              <div className="flex items-center gap-2">
                <Select value={itemsPerPage} onValueChange={setItemsPerPage}>
                  <SelectTrigger className="h-8 w-[100px]">
                    <SelectValue placeholder="5 / Page" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 / Page</SelectItem>
                    <SelectItem value="10">10 / Page</SelectItem>
                    <SelectItem value="20">20 / Page</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <span>Go to</span>
                <Input
                  className="h-8 w-12 px-1 text-center"
                  value={currentPage}
                  onChange={(e) => {
                    const val = parseInt(e.target.value)
                    if (val >= 1 && val <= totalPages) setCurrentPage(val)
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Background Gradient Overlay - Matching the design's dark abstract feel */}
      <div className="fixed inset-0 -z-10 h-full w-full bg-background pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-900/20 via-background to-blue-900/20 opacity-50 blur-3xl" />
      </div>
    </div>
  )
}

function EventCard({ event }: { event: EventItem }) {
  return (
    <Link href={`/event/${event.id}`} className="block">
      <div className="group relative flex flex-col overflow-hidden rounded-xl bg-card/50 border border-border/50 hover:border-primary/50 transition-colors cursor-pointer h-full">
        {/* Image Container */}
        <div className="relative aspect-video w-full overflow-hidden bg-muted">
          <Image
            src={event.imageUrl}
            alt={event.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* Content */}
        <div className="flex flex-col gap-3 p-4 flex-1">
          <h3 className="font-medium text-lg leading-tight line-clamp-2">
            {event.title}
          </h3>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{event.dateRange}</span>
            <Badge
              variant="outline"
              className="rounded-sm border-orange-500/50 text-orange-500 bg-orange-500/10 px-1.5 py-0 text-[10px] font-normal uppercase tracking-wide"
            >
              {event.status}
            </Badge>
          </div>

          <div className="flex items-center gap-2 mt-auto pt-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={event.artist.avatarUrl} />
              <AvatarFallback className="text-[10px]">
                {event.artist.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">
              {event.artist.name}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
