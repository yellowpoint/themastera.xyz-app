'use client'

import EventStatusBadge from '@/components/EventStatusBadge'
import SortSearchToolbar from '@/components/SortSearchToolbar'
import TopTabs from '@/components/TopTabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
import { cn, formatDateRange } from '@/lib/utils'
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

// --- Types ---
interface EventItem {
  id: string
  title: string
  dateRange: string
  status: 'Upcoming' | 'On viewing' | 'Archive'
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
  const [itemsPerPage, setItemsPerPage] = useState('6')
  const [currentPage, setCurrentPage] = useState(1)
  const [events, setEvents] = useState<EventItem[]>([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)

  // Map tab key to status
  const statusMap: Record<string, string> = {
    'on-viewing': 'On viewing',
    upcoming: 'Upcoming',
    archive: 'Archive',
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
            dateRange: formatDateRange(item.dates) || item.period || '',
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
    <div className="flex flex-col h-full">
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
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 h-auto md:h-12 px-2 text-sm bg-overlay rounded-xl backdrop-blur py-1">
            <div className="hidden md:block">Total {total} items</div>

            <div className="flex flex-wrap items-center gap-3 md:gap-6 ">
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
                              'h-8 w-8 cursor-pointer border-0',
                              currentPage === p &&
                                'bg-primary! text-primary-foreground hover:bg-primary/90'
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
                  <SelectTrigger className="h-8 w-[100px] border-0">
                    <SelectValue placeholder="6 / Page" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6">6 / Page</SelectItem>
                    <SelectItem value="12">12 / Page</SelectItem>
                    <SelectItem value="24">24 / Page</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="hidden md:flex items-center gap-2">
                <span>Go to</span>
                <Input
                  className="h-8 w-12 px-1 text-center dark:bg-input/30"
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
    </div>
  )
}

function EventCard({ event }: { event: EventItem }) {
  return (
    <Link href={`/event/${event.id}`} className="block">
      <div className="group relative flex flex-col overflow-hidden rounded-xl bg-card/50 cursor-pointer h-full">
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
            <EventStatusBadge status={event.status} />
          </div>

          <div className="flex items-center gap-2 mt-auto">
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
