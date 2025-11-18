'use client'
import { Skeleton } from '@/components/ui/skeleton'
import type { HomepageItem } from '@/contracts/domain/work'
import { formatViews } from '@/lib/format'
import { request } from '@/lib/request'
import MuxPlayer from '@mux/mux-player-react'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

export default function HomePage() {
  const [items, setItems] = useState<HomepageItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
    nodes.forEach((node) => node && observer.observe(node))

    return () => {
      nodes.forEach((node) => node && observer.unobserve(node))
      observer.disconnect()
    }
  }, [items])

  const resolvePlayback = (fileUrl?: string | null) => {
    const src = fileUrl || ''
    const m = src.match(/stream\.mux\.com\/([^.?]+)/)
    const playbackId = m?.[1]
    return { playbackId, src }
  }

  return (
    <div className="h-full">
      <div className="px-4 py-4">
        {loading ? (
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
                >
                  <Link
                    href={`/content/${w.id}`}
                    prefetch
                    aria-label={w.title || 'View content'}
                    className="block"
                  >
                    <div className="relative rounded-2xl overflow-hidden cursor-pointer transition hover:ring-2 hover:ring-white/20">
                    <MuxPlayer
                      className="w-full aspect-video"
                      {...(playbackId ? { playbackId } : { src })}
                      autoPlay
                      muted
                      loop
                      playsInline
                      streamType="on-demand"
                    />
                    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between rounded-xl bg-black/40 px-3 py-2">
                      <div className="min-w-0">
                        <div className="text-white text-sm truncate">
                          {w.title}
                        </div>
                        <div className="text-white/80 text-xs truncate">
                          {w.user?.name}
                        </div>
                      </div>
                      <div className="text-white text-xs whitespace-nowrap">
                        {formatViews(w.views || w.downloads || 0)} views
                      </div>
                    </div>
                    </div>
                  </Link>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
