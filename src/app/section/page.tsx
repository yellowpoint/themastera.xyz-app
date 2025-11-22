'use client'
import BackButton from '@/components/BackButton'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import VideoPlayer from '@/components/VideoPlayer'
import WorkCardList from '@/components/WorkCardList'
import { HOMEPAGE_SECTIONS } from '@/config/sections'
import type { Work } from '@/contracts/domain/work'
import { request } from '@/lib/request'
import { Pause, Play, Search, Volume2, VolumeX } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'

export default function SectionUnifiedPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const section = searchParams.get('section') || undefined
  const initialPage = parseInt(searchParams.get('page') || '1')
  const filterCategory = searchParams.get('category') || undefined
  const filterLanguage = searchParams.get('language') || undefined

  const [page, setPage] = useState<number>(initialPage)
  const [limit] = useState<number>(20) // Increased limit to have enough items for hero + grid
  const [items, setItems] = useState<Work[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [loadingMore, setLoadingMore] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [searchQuery, setSearchQuery] = useState('')

  const [heroPlaying, setHeroPlaying] = useState(false)
  const [heroMuted, setHeroMuted] = useState(true)
  const heroPlayerRef = useRef<HTMLDivElement>(null)

  // Build a unified header title based on whichever filter is active
  const headerTitle = useMemo(() => {
    if (section) {
      const meta = HOMEPAGE_SECTIONS.find((s) => s.id === section)
      return meta?.title || section
    }
    if (filterCategory) return `Category: ${filterCategory}`
    if (filterLanguage) return `Language: ${filterLanguage}`
    return 'All Items'
  }, [section, filterCategory, filterLanguage])

  useEffect(() => {
    async function fetchPage() {
      if (page === 1) {
        setLoading(true)
      } else {
        setLoadingMore(true)
      }
      setError(null)
      try {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(limit),
        })
        if (filterCategory) params.set('category', filterCategory)
        if (filterLanguage) params.set('language', filterLanguage)
        if (section) params.set('section', section)
        const { data } = await request.get<Work>(
          `/api/section?${params.toString()}`
        )
        if (data?.success) {
          const payload = (data.data as any)?.items as any[]
          setItems((prev) =>
            page === 1 ? payload || [] : [...prev, ...(payload || [])]
          )
          setTotalPages((data.data as any)?.pagination?.totalPages || 1)
        } else {
          setError((data as any)?.error || 'Failed to load items')
        }
      } catch (e) {
        setError('Network error, please try again')
      } finally {
        if (page === 1) {
          setLoading(false)
        } else {
          setLoadingMore(false)
        }
      }
    }
    // Treat section, category, and language as equivalent filters
    if (section || filterCategory || filterLanguage) fetchPage()
  }, [section, page, limit, filterCategory, filterLanguage])

  const canLoadMore = page < totalPages

  const [currentIndex, setCurrentIndex] = useState(0)
  const heroItem = items[currentIndex]
  const carouselItems = items.slice(0, 4)
  
  const handleVideoEnded = () => {
      if (items.length > 0) {
          setCurrentIndex((prev) => (prev + 1) % items.length)
      }
  }

  const gridItems = items.filter(item => {
      if (!searchQuery) return true
      return item.title.toLowerCase().includes(searchQuery.toLowerCase())
  })

  const resolvePlayback = (fileUrl?: string | null) => {
    const src = fileUrl || ''
    const m = src.match(/stream\.mux\.com\/([^.?]+)/)
    const playbackId = m?.[1]
    return { playbackId, src }
  }

  const toggleHeroPlay = () => {
      const player = heroPlayerRef.current?.querySelector('mux-player') as any
      if (player) {
          if (player.paused) {
              player.play()
              setHeroPlaying(true)
          } else {
              player.pause()
              setHeroPlaying(false)
          }
      }
  }

  const toggleHeroMute = () => {
      const player = heroPlayerRef.current?.querySelector('mux-player') as any
      if (player) {
          player.muted = !player.muted
          setHeroMuted(player.muted)
      }
  }
  
  // Sync hero state with player events
  useEffect(() => {
      const player = heroPlayerRef.current?.querySelector('mux-player') as any
      if (!player) return

      const onPlay = () => setHeroPlaying(true)
      const onPause = () => setHeroPlaying(false)
      const onVolumeChange = () => setHeroMuted(player.muted)

      player.addEventListener('play', onPlay)
      player.addEventListener('pause', onPause)
      player.addEventListener('volumechange', onVolumeChange)

      return () => {
          player.removeEventListener('play', onPlay)
          player.removeEventListener('pause', onPause)
          player.removeEventListener('volumechange', onVolumeChange)
      }
  }, [heroItem])


  if (loading && items.length === 0) {
      return <div className="container mx-auto px-4 py-6 text-center">Loading...</div>
  }

  if (error && items.length === 0) {
      return <div className="container mx-auto px-4 py-6 text-center text-red-500">{error}</div>
  }

  return (
    <div className="mux-player-controls-none container mx-auto px-4 py-6 space-y-8">
      <BackButton />
      {/* Hero Section */}
      {heroItem && (
        <div className="relative w-full aspect-video rounded-3xl overflow-hidden group" ref={heroPlayerRef}>
             <VideoPlayer
                title={heroItem.title}
                videoUrl={resolvePlayback(heroItem.fileUrl).src}
                loop={false}
                muted={heroMuted}
                autoPlay
                className="w-full h-full object-cover"
                onEnded={handleVideoEnded}
             />
             
             {/* Overlay */}
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
             
             {/* Bottom Content */}
             <div className="absolute bottom-0 left-0 right-0 p-8 flex items-end justify-between pointer-events-auto">
                 <div className="flex items-end gap-6 w-full">
                     {/* Carousel Thumbnails */}
                     <div className="flex gap-3 flex-shrink-0">
                         {carouselItems.map((item, index) => {
                             const isCurrent = index === currentIndex
                             return (
                                 <div 
                                     key={item.id} 
                                     className={`w-[100px] h-[73px] rounded-lg overflow-hidden cursor-pointer transition-all relative ${isCurrent ? 'opacity-100' : 'opacity-30 hover:opacity-100'}`}
                                     onClick={() => setCurrentIndex(index)}
                                 >
                                     <img src={item.thumbnailUrl || '/thumbnail-placeholder.svg'} alt={item.title} className="w-full h-full object-cover" />
                                 </div>
                             )
                         })}
                     </div>

                     {/* Hero Info */}
                     <div className="flex-1 min-w-0 mb-2 flex flex-col items-start gap-2">
                         <div className="flex items-center gap-3 w-full min-w-0">
                             <span className="flex-none text-highlight text-base font-normal ">Watch Free</span>
                             <h1 className="text-white flex-1 text-xl font-normal  truncate">{heroItem.title}</h1>
                         </div>
                         <div className="flex items-center gap-4 text-white/90 w-full">
                             <div className="flex items-center gap-2">
                                 <span className="font-medium text-white text-base ">{heroItem.user?.name}</span>
                             </div>
                             
                   

                             {/* Controls */}
                             <div className="flex items-center gap-1">
                                 <button onClick={toggleHeroPlay} className="w-[18px] h-[18px] bg-white/10 rounded-[2px] flex items-center justify-center hover:bg-white/20 transition-colors text-white">
                                     {heroPlaying ? <Pause size={12} fill="currentColor" /> : <Play size={12} fill="currentColor" />}
                                 </button>
                       
                                 <button onClick={toggleHeroMute} className="w-[18px] h-[18px] bg-white/10 rounded-[2px] flex items-center justify-center hover:bg-white/20 transition-colors text-white">
                                     {heroMuted ? <VolumeX size={12} /> : <Volume2 size={12} />}
                                 </button>
                             </div>
                         </div>
                     </div>
                 </div>
             </div>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="flex items-center gap-4">
          <Button variant="secondary" className="bg-muted text-muted-foreground hover:text-foreground">
              A-Z
          </Button>
          <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search the video name" 
                className="pl-9 bg-muted border-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
          </div>
      </div>

      {/* Grid List */}
      <WorkCardList
        works={gridItems}
        isLoading={loading && items.length === 0}
        isLoadingMore={loadingMore}
        hasMore={canLoadMore}
        onLoadMore={() => setPage(p => p + 1)}
        columns={4}
      />
    </div>
  )
}
