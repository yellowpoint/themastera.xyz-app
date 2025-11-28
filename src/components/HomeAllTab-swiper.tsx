'use client'
import { Skeleton } from '@/components/ui/skeleton'
import type { HomepageItem } from '@/contracts/domain/work'
import { request } from '@/lib/request'
import { Pause, Play, Volume2, VolumeX } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import 'swiper/css'
import { Mousewheel } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

const VideoPlayerLazy = dynamic(() => import('@/components/VideoPlayer'), {
  ssr: false,
  loading: () => <Skeleton className="aspect-video w-full rounded-xl" />,
})

export default function HomeAllTab() {
  const [items, setItems] = useState<HomepageItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [playing, setPlaying] = useState<Record<string, boolean>>({})
  const [muted, setMuted] = useState<Record<string, boolean>>({})
  const [activeId, setActiveId] = useState<string | null>(null)
  const playersRef = useRef<Record<string, HTMLDivElement | null>>({})
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const DEFAULT_LIMIT = 12
        const { data } = await request.get(
          `/api/homepage?limit=${DEFAULT_LIMIT}`
        )
        const quickPicks = (data as any)?.data?.quickPicks || []
        setItems(quickPicks)
      } catch (e: any) {
        setError(e?.message || 'Failed to load')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (items.length && !activeId) setActiveId(items[0]?.id || null)
  }, [items, activeId])

  useEffect(() => {
    const currentId = activeId
    Object.entries(playersRef.current).forEach(([id, node]) => {
      const player = node?.querySelector('mux-player') as any
      if (!player) return
      if (id !== currentId && !player.paused) {
        try {
          player.pause()
        } catch {}
      }
    })
    if (!currentId) return
    const node = playersRef.current[currentId]
    const player = node?.querySelector('mux-player') as any
    if (!player) return
    const handlePlay = () => {
      setPlaying((p) => ({ ...p, [currentId]: true }))
    }
    const handlePause = () => {
      setPlaying((p) => ({ ...p, [currentId]: false }))
    }
    const handleVolumeChange = () => {
      setMuted((m) => ({ ...m, [currentId]: !!player.muted }))
    }
    player.addEventListener('play', handlePlay)
    player.addEventListener('pause', handlePause)
    player.addEventListener('volumechange', handleVolumeChange)
    setPlaying((p) => ({ ...p, [currentId]: !player.paused }))
    setMuted((m) => ({ ...m, [currentId]: !!player.muted }))
    return () => {
      try {
        player.removeEventListener('play', handlePlay)
        player.removeEventListener('pause', handlePause)
        player.removeEventListener('volumechange', handleVolumeChange)
      } catch {}
    }
  }, [activeId])

  const resolvePlayback = (fileUrl?: string | null) => {
    const src = fileUrl || ''
    const m = src.match(/stream\.mux\.com\/([^.?]+)/)
    const playbackId = m?.[1]
    return { playbackId, src }
  }

  const togglePlay = (id: string) => {
    const container = playersRef.current[id]
    const player = container?.querySelector('mux-player') as any
    if (!player) return
    try {
      if (player.paused) {
        player.play()
        setPlaying((p) => ({ ...p, [id]: true }))
      } else {
        player.pause()
        setPlaying((p) => ({ ...p, [id]: false }))
      }
    } catch {}
  }

  const toggleMute = (id: string) => {
    const container = playersRef.current[id]
    const player = container?.querySelector('mux-player') as any
    if (!player) return
    try {
      player.muted = !player.muted
      setMuted((m) => ({ ...m, [id]: !!player.muted }))
    } catch {}
  }

  if (loading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton key={i} className="aspect-video w-full rounded-xl" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-sm text-muted-foreground max-w-5xl mx-auto">
        {error}
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto">
      <Swiper
        direction="vertical"
        slidesPerView={1.1}
        spaceBetween={16}
        mousewheel
        modules={[Mousewheel]}
        className="h-[85vh] md:h-[85vh]"
        onActiveIndexChange={(s) => {
          const cur = items[s.activeIndex]
          setActiveId(cur?.id || null)
        }}
      >
        {items.map((w) => {
          const { playbackId, src } = resolvePlayback(w.fileUrl)
          return (
            <SwiperSlide key={w.id}>
              <div
                ref={(el) => {
                  playersRef.current[w.id] = el
                }}
                data-pid={playbackId || ''}
                data-id={w.id}
                className="py-2 md:py-4"
              >
                <div aria-label={w.title || 'View content'} className="block">
                  <div
                    className={`relative z-0 rounded-2xl overflow-hidden cursor-pointer transition aspect-video`}
                  >
                    {activeId === w.id ? (
                      <VideoPlayerLazy
                        noControls
                        title={w.title}
                        videoUrl={src}
                        thumbnailUrl={w.thumbnailUrl || undefined}
                        autoPlay
                        loop
                        muted
                      />
                    ) : (
                      <img
                        src={w.thumbnailUrl || '/thumbnail-placeholder.svg'}
                        alt={w.title || 'Thumbnail'}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    )}
                    <div
                      className="absolute inset-0 z-10"
                      onClick={(e) => {
                        e.stopPropagation()
                        router.push(`/content/${w.id}`)
                      }}
                    >
                      <div className="absolute top-4 left-4 max-w-[30%] bg-[#1D212999] backdrop-blur-md rounded-xl px-4 py-3 shadow-lg">
                        <div className="text-white text-lg  truncate">
                          {w.title}
                        </div>
                        <div className="text-white/80 text-sm truncate">
                          {w.user?.name}
                        </div>
                      </div>
                      <span className="absolute top-4 right-4 bg-highlight text-primary text-xs rounded px-3 py-1">
                        Watch Free
                      </span>
                      {activeId === w.id && (
                        <div className="absolute bottom-4 left-4 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              togglePlay(w.id)
                            }}
                            aria-label="Play"
                            className="pointer-events-auto h-7 w-7 rounded-md bg-[#1D212999] text-white flex items-center justify-center"
                          >
                            {playing[w.id] ? (
                              <Pause className="size-4" />
                            ) : (
                              <Play className="size-4" />
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              toggleMute(w.id)
                            }}
                            aria-label="Volume"
                            className="pointer-events-auto h-7 w-7 rounded-md bg-[#1D212999] text-white flex items-center justify-center"
                          >
                            {muted[w.id] ? (
                              <VolumeX className="size-4" />
                            ) : (
                              <Volume2 className="size-4" />
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          )
        })}
      </Swiper>
    </div>
  )
}
