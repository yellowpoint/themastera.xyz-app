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
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

// --- Types ---
interface EventItem {
  id: string
  title: string
  dateRange: string
  status: 'Upcoming' | 'Ongoing' | 'Ended'
  imageUrl: string
  artist: {
    name: string
    avatarUrl: string
  }
}

// --- Mock Data ---
const MOCK_EVENTS: EventItem[] = Array.from({ length: 9 }).map((_, i) => ({
  id: `evt-${i}`,
  title: 'Shueisha Manga-Art Heritage Collection',
  dateRange: '2025.11.12-2025.11.25',
  status: 'Upcoming',
  imageUrl: `/bg/${(i % 8) + 1}.jpg`, // Using existing background images as placeholders
  artist: {
    name: 'Artist name',
    avatarUrl: '', // Fallback to initials
  },
}))

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_EVENTS.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 pb-4 text-sm text-muted-foreground">
          <div>Total 99999 items</div>

          <div className="flex items-center gap-6">
            <Pagination className="w-auto mx-0">
              <PaginationContent>
                <PaginationItem>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                </PaginationItem>
                {[1, 2, 3, 4, 5].map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      isActive={currentPage === page}
                      onClick={() => setCurrentPage(page)}
                      className={cn(
                        'h-8 w-8 cursor-pointer',
                        currentPage === page &&
                          'bg-primary text-primary-foreground hover:bg-primary/90'
                      )}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
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
              <Input className="h-8 w-12 px-1 text-center" defaultValue="20" />
            </div>
          </div>
        </div>
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
    <div className="group relative flex flex-col overflow-hidden rounded-xl bg-card/50 border border-border/50 hover:border-primary/50 transition-colors cursor-pointer">
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
      <div className="flex flex-col gap-3 p-4">
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

        <div className="flex items-center gap-2 mt-1">
          <Avatar className="h-6 w-6">
            <AvatarImage src={event.artist.avatarUrl} />
            <AvatarFallback className="text-[10px]">AN</AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">
            {event.artist.name}
          </span>
        </div>
      </div>
    </div>
  )
}
