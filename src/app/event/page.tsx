'use client'

import EventStatusBadge from '@/components/EventStatusBadge'
import SortSearchToolbar from '@/components/SortSearchToolbar'
import TopTabs from '@/components/TopTabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { request } from '@/lib/request'
import { formatDateRange } from '@/lib/utils'
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
  const [loadingMore, setLoadingMore] = useState(false)
  const [total, setTotal] = useState(0)

  // Map tab key to status
  const statusMap: Record<string, string> = {
    'on-viewing': 'On viewing',
    upcoming: 'Upcoming',
    archive: 'Archive',
  }

  const fetchEvents = async (pageNum: number, append = false) => {
    if (append) setLoadingMore(true)
    else setLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchQuery) params.set('q', searchQuery)
      const status = statusMap[activeTab]
      if (status) params.set('status', status)
      params.set('page', String(pageNum))
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
        if (append) {
          setEvents((prev) => [...prev, ...mappedEvents])
          setCurrentPage(pageNum)
        } else {
          setEvents(mappedEvents)
          setTotal(data.data.pagination?.total || 0)
          setCurrentPage(pageNum)
        }
      }
    } catch (error) {
      console.error(error)
    } finally {
      if (append) setLoadingMore(false)
      else setLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1)
      fetchEvents(1, false)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery, activeTab, itemsPerPage])

  const hasMore = events.length < total

  return (
    <div className="page-container">
      <TopTabs tabs={TABS} activeKey={activeTab} onChange={setActiveTab} />

      {/* Main Content */}
      <main className="space-y-6">
        <h1 className="text-4xl">Event</h1>
        <SortSearchToolbar
          showSortButtons={false}
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          searchPlaceholder="Search event name"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: parseInt(itemsPerPage) }).map((_, i) => (
              <EventCardSkeleton key={i} />
            ))
          ) : events.length > 0 ? (
            events.map((event) => <EventCard key={event.id} event={event} />)
          ) : (
            <div className="col-span-full text-center py-10 text-muted-foreground">
              No events found
            </div>
          )}

          {loadingMore &&
            Array.from({ length: Math.min(3, parseInt(itemsPerPage)) }).map(
              (_, i) => <EventCardSkeleton key={`more-${i}`} />
            )}

          {hasMore && events.length > 0 && !loading && (
            <div className="col-span-full flex justify-center">
              <Button
                onClick={() => fetchEvents(currentPage + 1, true)}
                disabled={loadingMore}
                type="button"
              >
                {loadingMore ? 'Loading...' : 'Load more'}
              </Button>
            </div>
          )}
          {!loading && !loadingMore && !hasMore && events.length > 0 && (
            <div className="col-span-full flex justify-center">
              <p className="text-sm text-muted-foreground" aria-live="polite">
                All items loaded
              </p>
            </div>
          )}
        </div>
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

function EventCardSkeleton() {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl bg-card/50 h-full">
      <Skeleton className="aspect-video w-full" />
      <div className="flex flex-col gap-3 p-4 flex-1">
        <div className="space-y-2">
          <Skeleton className="h-5 w-3/4" />
        </div>
        <div className="flex items-center gap-2 text-xs">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-5 w-20" />
        </div>
        <div className="flex items-center gap-2 mt-auto">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    </div>
  )
}
