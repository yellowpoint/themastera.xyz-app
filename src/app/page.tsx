'use client'
import WatchHistoryPage from '@/app/history/page'
import SubscriptionsPage from '@/app/subscriptions/page'
import TopTabs from '@/components/TopTabs'
import { Skeleton } from '@/components/ui/skeleton'
import VideoPlayer from '@/components/VideoPlayer'
import type { HomepageItem } from '@/contracts/domain/work'
import { request } from '@/lib/request'
import { Pause, Play, Volume2, VolumeX } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

export default function HomePage() {
  const [items, setItems] = useState<HomepageItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<
    'All' | 'Subscriptions' | 'History'
  >('All')
  const router = useRouter()
  const [playing, setPlaying] = useState<Record<string, boolean>>({})
  const [muted, setMuted] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const { data } = await request.get(`/api/homepage`)
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

  const playersRef = useRef<Record<string, HTMLDivElement | null>>({})

  useEffect(() => {
    const visibleElements = new Map<Element, IntersectionObserverEntry>()

    const playMostVisible = () => {
      let mostVisibleEntry: IntersectionObserverEntry | null = null
      for (const entry of visibleElements.values()) {
        if (
          !mostVisibleEntry ||
          entry.intersectionRatio > mostVisibleEntry.intersectionRatio
        ) {
          mostVisibleEntry = entry
        }
      }

      if (mostVisibleEntry) {
        const playerToPlay = mostVisibleEntry.target.querySelector(
          'mux-player'
        ) as any
        // Pause all other players
        for (const entry of visibleElements.values()) {
          if (entry.target !== mostVisibleEntry.target) {
            const player = entry.target.querySelector('mux-player') as any
            if (player && !player.paused) {
              try {
                player.pause()
              } catch {}
            }
          }
        }
        // Play the most visible one
        if (playerToPlay && playerToPlay.paused) {
          try {
            playerToPlay.play()
          } catch {}
        }
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visibleElements.set(entry.target, entry)
          } else {
            visibleElements.delete(entry.target)
            const player = entry.target.querySelector('mux-player') as any
            if (player && !player.paused) {
              try {
                player.pause()
              } catch {}
            }
          }
        })
        playMostVisible()
      },
      {
        threshold: Array.from({ length: 20 }, (_, i) => i * 0.05),
      }
    )

    const nodes = Object.values(playersRef.current).filter(Boolean)
    nodes.forEach((node) => {
      if (!node) return
      observer.observe(node)
      const player = node.querySelector('mux-player') as any
      const id = node.getAttribute('data-id') || ''
      if (player && id) {
        const handlePlay = () => {
          setPlaying((p) => ({ ...p, [id]: true }))
        }
        const handlePause = () => {
          setPlaying((p) => ({ ...p, [id]: false }))
        }
        const handleVolumeChange = () => {
          setMuted((m) => ({ ...m, [id]: !!player.muted }))
        }
        player.addEventListener('play', handlePlay)
        player.addEventListener('pause', handlePause)
        player.addEventListener('volumechange', handleVolumeChange)
        // initialize state
        setPlaying((p) => ({ ...p, [id]: !player.paused }))
        setMuted((m) => ({ ...m, [id]: !!player.muted }))
        ;(node as any).__listeners = {
          handlePlay,
          handlePause,
          handleVolumeChange,
        }
      }
    })

    return () => {
      nodes.forEach((node) => {
        if (!node) return
        const player = node.querySelector('mux-player') as any
        const listeners = (node as any).__listeners
        if (player && listeners) {
          player.removeEventListener('play', listeners.handlePlay)
          player.removeEventListener('pause', listeners.handlePause)
          player.removeEventListener(
            'volumechange',
            listeners.handleVolumeChange
          )
        }
        observer.unobserve(node)
      })
      observer.disconnect()
    }
  }, [items])

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
  const tabList = [
    { key: 'All', label: 'All' },
    { key: 'Subscriptions', label: 'Subscriptions' },
    { key: 'History', label: 'History' },
  ]
  return (
    <div className="mux-player-controls-none h-full">
      <div className="">
        <TopTabs
          tabs={tabList as any}
          activeKey={activeTab}
          onChange={(key) => setActiveTab(key as any)}
        />
      </div>
      <div className="px-4 py-4">
        {activeTab === 'Subscriptions' ? (
          <SubscriptionsPage />
        ) : activeTab === 'History' ? (
          <WatchHistoryPage />
        ) : loading ? (
          <div className="space-y-6 max-w-5xl mx-auto">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="aspect-video w-full rounded-xl" />
            ))}
          </div>
        ) : error ? (
          <div className="text-sm text-muted-foreground max-w-5xl mx-auto">
            {error}
          </div>
        ) : (
          <div className="space-y-6 max-w-5xl mx-auto">
            {items.map((w) => {
              const { playbackId, src } = resolvePlayback(w.fileUrl)
              return (
                <div
                  key={w.id}
                  ref={(el) => {
                    playersRef.current[w.id] = el
                  }}
                  data-pid={playbackId || ''}
                  data-id={w.id}
                >
                  <div
                    onClick={(e) => {
                      router.push(`/content/${w.id}`)
                    }}
                    aria-label={w.title || 'View content'}
                    className="block"
                  >
                    <div className="relative z-0 rounded-2xl overflow-hidden cursor-pointer transition aspect-video">
                      <VideoPlayer
                        title={w.title}
                        videoUrl={src}
                        loop
                        muted
                        onPlay={() =>
                          setPlaying((p) => ({ ...p, [w.id]: true }))
                        }
                        onPause={() =>
                          setPlaying((p) => ({ ...p, [w.id]: false }))
                        }
                      />
                      <div
                        className="absolute bottom-6 left-0 right-0 flex items-center justify-between bg-[#1D212966] backdrop-blur-md px-8 cursor-auto py-2"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                        }}
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="bg-highlight text-primary flex-none text-xs rounded px-2 py-1">
                              Watch Free
                            </span>
                            <div className="text-white text-xl truncate">
                              {w.title}
                            </div>
                          </div>
                          <div className="text-white truncate">
                            {w.user?.name}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                togglePlay(w.id)
                              }}
                              aria-label="Play"
                              className="h-6 w-6  text-white flex items-center justify-center"
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
                              className="h-6 w-6 text-white flex items-center justify-center"
                            >
                              {muted[w.id] ? (
                                <VolumeX className="size-4" />
                              ) : (
                                <Volume2 className="size-4" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
