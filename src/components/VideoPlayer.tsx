'use client'
import { cn } from '@/lib/utils'
import MuxPlayer from '@mux/mux-player-react'
import { useEffect, useRef, useState } from 'react'

type VideoPlayerProps = {
  videoUrl?: string
  thumbnailUrl?: string
  title?: string

  className?: string
  onPlay?: () => void
  onPause?: () => void
  onEnded?: () => void
  autoPlay?: boolean
  muted?: boolean
  loop?: boolean
  noControls?: boolean
}

export default function VideoPlayer({
  videoUrl,
  thumbnailUrl,
  title = 'Video Content',
  className = '',
  onPlay,
  onPause,
  onEnded,
  autoPlay = false,
  muted = false,
  loop = false,
  noControls = false,
}: VideoPlayerProps) {
  const playerRef = useRef<any>(null)
  const [loadingState, setLoadingState] = useState(true)

  useEffect(() => {
    const el = playerRef.current as any
    if (!el) return
    try {
      el.noMutedPref = true
      el.noVolumePref = true
      if (autoPlay && muted === false) {
        el.autoplay = 'any'
      }
      el.volume = 1
      el.muted = !!muted
    } catch {}
  }, [autoPlay, muted])

  useEffect(() => {
    const el = playerRef.current as any
    if (!el) return
    const enforce = () => {
      try {
        el.volume = 1
        el.muted = !!muted
      } catch {}
    }
    el.addEventListener('loadedmetadata', enforce)
    el.addEventListener('canplay', enforce)
    el.addEventListener('play', enforce)
    return () => {
      el.removeEventListener('loadedmetadata', enforce)
      el.removeEventListener('canplay', enforce)
      el.removeEventListener('play', enforce)
    }
  }, [muted])
  // Handle play event
  const handlePlay = () => {
    onPlay && onPlay()
  }

  const handlePause = () => {
    onPause && onPause()
  }

  const handleEnded = () => {
    onEnded && onEnded()
  }

  // If there is no video source, display an error message
  if (!videoUrl) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-overlay rounded-lg">
        <div className="text-center">
          <p className="mb-2 text-white">Video file does not exist</p>
          <p className="text-sm text-gray-400">
            Please check if the video file has been uploaded
          </p>
        </div>
      </div>
    )
  }

  // Show video player when there is access
  return (
    <div
      className={cn(
        'relative rounded-lg overflow-hidden w-full h-full',
        noControls ? 'mux-player-controls-none' : '',
        className
      )}
    >
      {(() => {
        const isMuxPlayback = videoUrl && videoUrl.includes('stream.mux.com')
        if (isMuxPlayback) {
          const effectivePlaybackId = videoUrl?.match(
            /stream\.mux\.com\/([^.?]+)/
          )?.[1]
          return (
            <MuxPlayer
              accent-color="var(--primary)"
              playbackId={effectivePlaybackId}
              poster={thumbnailUrl}
              preload="metadata"
              renditionOrder="desc"
              metadata={{
                video_title: title,
              }}
              streamType="on-demand"
              autoPlay={autoPlay}
              muted={muted}
              loop={loop}
              ref={playerRef}
              playsInline
              className="w-full h-full"
              style={{
                ['--media-object-fit' as any]: 'cover',
                ['--media-object-position' as any]: 'center',
              }}
              onPlay={handlePlay}
              onPause={handlePause}
              onEnded={handleEnded}
              onWaiting={() => setLoadingState(true)}
              onPlaying={() => setLoadingState(false)}
              onCanPlay={() => setLoadingState(false)}
              onLoadedData={() => setLoadingState(false)}
            />
          )
        }
        return (
          <div className="flex items-center justify-center h-full bg-card/70 rounded-lg">
            <div className="text-center">
              <p className="text-gray-500 mb-2">Unsupported video source</p>
            </div>
          </div>
        )
      })()}
      {noControls && loadingState && (
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          <div className="size-6 md:size-12 rounded-full border-2 md:border-4 border-white border-t-transparent animate-spin" />
        </div>
      )}
    </div>
  )
}
