'use client'
import BackButton from '@/components/BackButton'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import VideoPlayer from '@/components/VideoPlayer'
import WorkCardList from '@/components/WorkCardList'
import { HOMEPAGE_SECTIONS } from '@/config/sections'
import type { Work } from '@/contracts/domain/work'
import { request } from '@/lib/request'
import { MoreVertical, Pause, Play, Search, Volume2, VolumeX } from 'lucide-react'
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

  const heroItem = items[0]
  const carouselItems = items.slice(1, 5)
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
    <div className="container mx-auto px-4 py-6 space-y-8">
      <BackButton />
      {/* Hero Section */}
      {heroItem && (
        <div className="relative w-full aspect-video rounded-3xl overflow-hidden group" ref={heroPlayerRef}>
             <VideoPlayer
                title={heroItem.title}
                videoUrl={resolvePlayback(heroItem.fileUrl).src}
                loop
                muted={heroMuted}
                autoPlay
                className="w-full h-full object-cover"
             />
             
             {/* Overlay */}
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
             
             {/* Bottom Content */}
             <div className="absolute bottom-0 left-0 right-0 p-8 flex items-end justify-between pointer-events-auto">
                 <div className="flex items-end gap-6 w-full">
                     {/* Carousel Thumbnails */}
                     <div className="flex gap-4 flex-shrink-0">
                         {carouselItems.map(item => (
                             <div 
                                key={item.id} 
                                className="w-32 aspect-video rounded-lg overflow-hidden border-2 border-transparent hover:border-white/50 cursor-pointer transition-all relative"
                                onClick={() => router.push(`/content/${item.id}`)}
                             >
                                 <img src={item.thumbnailUrl || '/thumbnail-placeholder.svg'} alt={item.title} className="w-full h-full object-cover" />
                                 <div className="absolute inset-0 bg-black/20 hover:bg-transparent transition-colors" />
                             </div>
                         ))}
                     </div>

                     {/* Hero Info */}
                     <div className="flex-1 min-w-0 mb-2">
                         <div className="flex items-center gap-3 mb-2">
                             <span className="text-[#EAB308] font-medium">Watch Free</span>
                             <h1 className="text-white text-3xl font-bold truncate">{heroItem.title}</h1>
                         </div>
                         <div className="flex items-center gap-4 text-white/90">
                             <div className="flex items-center gap-2">
                                 <img 
                                    src={heroItem.user?.image || '/avatar-placeholder.svg'} 
                                    alt={heroItem.user?.name} 
                                    className="w-6 h-6 rounded-full"
                                 />
                                 <span className="font-medium">{heroItem.user?.name}</span>
                             </div>
                             {/* Controls */}
                             <div className="flex items-center gap-2 ml-4">
                                 <button onClick={toggleHeroPlay} className="p-1 hover:text-[#EAB308] transition-colors text-white">
                                     {heroPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                                 </button>
                                 <div className="text-xs text-white/70 font-mono">
                                     {heroItem.duration || '00:00'} / {heroItem.duration || '00:00'}
                                 </div>
                                 <button onClick={toggleHeroMute} className="p-1 hover:text-[#EAB308] transition-colors text-white ml-2">
                                     {heroMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                                 </button>
                                 <button className="p-1 hover:text-[#EAB308] transition-colors text-white ml-1">
                                     <MoreVertical size={20} />
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
