'use client'
import { Card, CardContent } from '@/components/ui/card'
import MuxPlayer from '@mux/mux-player-react'
import { useEffect, useRef, useState } from 'react'

type VideoPlayerProps = {
  videoUrl?: string
  thumbnailUrl?: string
  title?: string
  width?: string | number
  height?: string | number
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
  width = '100%',
  height = '400px',
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
      <Card className={className}>
        <CardContent className="p-0">
          <div
            style={{ width, height }}
            className="flex items-center justify-center bg-gray-100 rounded-lg"
          >
            <div className="text-center">
              <p className="text-gray-500 mb-2">Video file does not exist</p>
              <p className="text-sm text-gray-400">
                Please check if the video file has been uploaded
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Show video player when there is access
  return (
    <div
      style={{ width }}
      className={`relative aspect-video rounded-lg overflow-hidden ${noControls ? 'mux-player-controls-none' : ''}`}
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
