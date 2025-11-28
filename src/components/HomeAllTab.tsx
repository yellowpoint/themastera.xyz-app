'use client'
import { Skeleton } from '@/components/ui/skeleton'
import VideoPlayer from '@/components/VideoPlayer'
import type { HomepageItem } from '@/contracts/domain/work'
import { request } from '@/lib/request'
import { Pause, Play, Volume2, VolumeX } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

export default function HomeAllTab() {
  const [items, setItems] = useState<HomepageItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [playing, setPlaying] = useState<Record<string, boolean>>({})
  const [muted, setMuted] = useState<Record<string, boolean>>({})
  const playersRef = useRef<Record<string, HTMLDivElement | null>>({})
  const router = useRouter()

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
      { threshold: Array.from({ length: 20 }, (_, i) => i * 0.05) }
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

  if (loading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        {Array.from({ length: 6 }).map((_, i) => (
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
    <div className="container space-y-6 mx-auto">
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
            <div aria-label={w.title || 'View content'} className="block">
              <div className="relative z-0 rounded-2xl overflow-hidden cursor-pointer transition aspect-video">
                <VideoPlayer
                  noControls
                  title={w.title}
                  videoUrl={src}
                  loop
                  muted
                />
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
                      className="pointer-events-auto h-7 w-7 rounded-md bg-[1D212999] text-white flex items-center justify-center"
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
        )
      })}
    </div>
  )
}
