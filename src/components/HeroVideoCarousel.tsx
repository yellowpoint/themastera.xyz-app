'use client'

import VideoPlayer from '@/components/VideoPlayer'
import type { Work } from '@/contracts/domain/work'
import { Pause, Play, Volume2, VolumeX } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'

type Props = {
  items: Work[]
  className?: string
}

export default function HeroVideoCarousel({ items, className }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [heroPlaying, setHeroPlaying] = useState(false)
  const [heroMuted, setHeroMuted] = useState(true)
  const heroPlayerRef = useRef<HTMLDivElement>(null)

  const carouselItems = useMemo(() => items.slice(0, 4), [items])
  const heroItem = items[currentIndex]

  const handleVideoEnded = () => {
    if (items.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % items.length)
    }
  }

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
        try {
          const playPromise = player.play()
          if (playPromise !== undefined) {
            playPromise.catch((error: any) => {
              if (error.name !== 'AbortError') {
                console.error('Play failed:', error)
              }
            })
          }
        } catch (e) {
          // ignore
        }
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

  if (!heroItem) return null

  return (
    <div
      className={`relative w-full aspect-video rounded-3xl overflow-hidden group ${className || ''}`}
      ref={heroPlayerRef}
    >
      <VideoPlayer
        noControls
        title={heroItem.title}
        videoUrl={resolvePlayback(heroItem.fileUrl).src}
        loop={false}
        muted={heroMuted}
        autoPlay
        className="w-full h-full object-cover"
        onEnded={handleVideoEnded}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 p-8 flex items-end justify-between pointer-events-auto">
        <div className="flex items-end gap-6 w-full">
          <div className="flex gap-3 flex-shrink-0">
            {carouselItems.map((item, index) => {
              const isCurrent = index === currentIndex
              return (
                <div
                  key={item.id}
                  className={`w-[100px] h-[74px] rounded-lg overflow-hidden cursor-pointer transition-all relative ${isCurrent ? 'opacity-100 ring-2 ring-white' : 'opacity-30 hover:opacity-100'}`}
                  onClick={() => setCurrentIndex(index)}
                >
                  <img
                    src={item.thumbnailUrl || '/thumbnail-placeholder.svg'}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )
            })}
          </div>
          <div className="flex-1 min-w-0 flex flex-col items-start justify-center gap-2 bg-overlay rounded-xl px-4 h-[74px]">
            <div className="flex items-center gap-3 w-full min-w-0">
              <span className="flex-none text-highlight text-base font-normal ">
                Watch Free
              </span>
              <h1 className="text-white flex-1 text-xl font-normal truncate">
                {heroItem.title}
              </h1>
            </div>
            <div className="flex items-center gap-4 text-white/90 w-full">
              <div className="flex items-center gap-2">
                <span className="font-medium text-white text-base ">
                  {heroItem.user?.name}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={toggleHeroPlay}
                  className="w-[18px] h-[18px] bg-overlay rounded-[2px] flex items-center justify-center hover:bg-overlay-hover transition-colors text-white"
                >
                  {heroPlaying ? (
                    <Pause size={12} fill="currentColor" />
                  ) : (
                    <Play size={12} fill="currentColor" />
                  )}
                </button>
                <button
                  onClick={toggleHeroMute}
                  className="w-[18px] h-[18px] bg-overlay rounded-[2px] flex items-center justify-center hover:bg-overlay-hover transition-colors text-white"
                >
                  {heroMuted ? <VolumeX size={12} /> : <Volume2 size={12} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
