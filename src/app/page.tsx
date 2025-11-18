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
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target as HTMLElement
          const player = el.querySelector('mux-player') as any
          if (!player) continue
          if (entry.isIntersecting) {
            try {
              player.play()
            } catch {}
          } else {
            try {
              player.pause()
            } catch {}
          }
        }
      },
      { threshold: 0.35 }
    )
    const nodes = Object.values(playersRef.current).filter(Boolean)
    nodes.forEach((n) => n && io.observe(n as Element))
    return () => {
      nodes.forEach((n) => n && io.unobserve(n as Element))
      io.disconnect()
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
