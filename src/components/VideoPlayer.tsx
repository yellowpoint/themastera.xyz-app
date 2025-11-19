'use client'
import { Card, CardContent } from '@/components/ui/card'
import MuxPlayer from '@mux/mux-player-react'

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
}

export default function VideoPlayer({
  videoUrl,
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
}: VideoPlayerProps) {
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
    <div style={{ width }} className="relative aspect-video">
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
              metadata={{
                video_title: title,
              }}
              streamType="on-demand"
              autoPlay={autoPlay}
              muted={muted}
              loop={loop}
              playsInline
              onPlay={handlePlay}
              onPause={handlePause}
              onEnded={handleEnded}
            />
          )
        }
        return (
          <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg">
            <div className="text-center">
              <p className="text-gray-500 mb-2">Unsupported video source</p>
            </div>
          </div>
        )
      })()}
    </div>
  )
}
