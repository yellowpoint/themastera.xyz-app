'use client'
import SubscribeButton from '@/components/SubscribeButton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { Download, Loader2, ThumbsDown, ThumbsUp } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

/**
 * VideoTitleInfo Component
 * Displays video title, creator info, subscribe button, and interaction buttons
 * Based on Figma design: Frame 3480659
 */
type VideoTitleInfoProps = {
  // Video info
  title?: string
  isPremium?: boolean

  // Creator info
  creatorId?: string
  creatorName?: string
  creatorAvatar?: string
  subscribersCount?: number

  // Follow state
  isFollowing?: boolean
  onFollow?: () => void

  // Like/Dislike state
  isLiked?: boolean
  isDisliked?: boolean
  likesCount?: number
  dislikesCount?: number
  onLike?: () => void | Promise<void>
  onDislike?: () => void | Promise<void>

  // Download
  onDownload?: () => void | Promise<void>

  className?: string
}

export default function VideoTitleInfo({
  // Video info
  title = 'Video Title',
  isPremium = false,

  // Creator info
  creatorId,
  creatorName = 'Creator Name',
  creatorAvatar,
  subscribersCount = 0,

  // Follow state
  isFollowing = false,
  onFollow,

  // Like/Dislike state
  isLiked = false,
  isDisliked = false,
  likesCount = 0,
  dislikesCount = 0,
  onLike,
  onDislike,

  // Download
  onDownload,

  className = '',
}: VideoTitleInfoProps) {
  const [likeLoading, setLikeLoading] = useState(false)
  const [dislikeLoading, setDislikeLoading] = useState(false)
  const [downloadLoading, setDownloadLoading] = useState(false)
  const { user: currentUser } = useAuth()
  const router = useRouter()
  const formatCount = (count) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`
    return count.toString()
  }

  const handleLikeClick = async () => {
    if (!currentUser?.id) {
      toast.error('Please sign in to like')
      router.push('/auth/login')
      return
    }
    if (likeLoading || dislikeLoading) return
    setLikeLoading(true)
    try {
      await onLike?.()
    } finally {
      setLikeLoading(false)
    }
  }

  const handleDislikeClick = async () => {
    if (!currentUser?.id) {
      toast.error('Please sign in to dislike')
      router.push('/auth/login')
      return
    }
    if (likeLoading || dislikeLoading) return
    setDislikeLoading(true)
    try {
      await onDislike?.()
    } finally {
      setDislikeLoading(false)
    }
  }

  const handleDownloadClick = async () => {
    if (!currentUser?.id) {
      toast.error('Please sign in to download')
      router.push('/auth/login')
      return
    }
    if (downloadLoading) return
    setDownloadLoading(true)
    try {
      await onDownload?.()
    } finally {
      setDownloadLoading(false)
    }
  }

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {/* Video Title */}
      <div className="px-6">
        <h1 className="text-3xl">{title}</h1>
      </div>

      {/* Creator Info and Action Buttons */}
      <div className="flex items-center justify-between gap-8 px-6">
        {/* Left Section: Creator Info + Subscribe Button */}
        <div className="flex items-center gap-2">
          {/* Creator Avatar and Info */}
          <div className="flex items-start gap-1">
            {/* Avatar */}
            <Link href={creatorId ? `/user/${creatorId}` : '#'}>
              <div>
                <Avatar className="h-12 w-12 cursor-pointer">
                  <AvatarImage src={creatorAvatar} />
                  <AvatarFallback className="bg-primary/20 text-white">
                    {creatorName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
            </Link>

            {/* Creator Name and Subscribers */}
            <div className="flex flex-col justify-center px-3 py-1 flex-none">
              <Link href={creatorId ? `/user/${creatorId}` : '#'}>
                <h3 className="">{creatorName}</h3>
              </Link>
              <p className="text-sm">
                {formatCount(subscribersCount)} subscribers
              </p>
            </div>
          </div>

          {/* Subscribe Button */}
          <SubscribeButton
            userId={creatorId as string}
            isFollowing={isFollowing}
            onChanged={() => onFollow?.()}
          />
        </div>

        {/* Right Section: Like/Dislike + Download + Pro Badge */}
        <div className="flex items-center gap-4 relative">
          {/* Like and Dislike Buttons Group */}
          <Button variant="secondary">
            {/* Like Button */}
            <button
              onClick={handleLikeClick}
              disabled={likeLoading || dislikeLoading}
              aria-busy={likeLoading}
              className="flex items-center gap-2.5 text-white hover:opacity-80 transition-opacity disabled:opacity-60"
            >
              {likeLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <ThumbsUp className={isLiked ? 'fill-white' : ''} />
              )}
              <span>{likesCount > 0 ? formatCount(likesCount) : 0}</span>
            </button>

            {/* Divider */}
            <div
              className="w-0 h-8 border-l-2 border-dashed opacity-20"
              style={{ borderColor: '#F2F3F5' }}
            />

            {/* Dislike Button */}
            <button
              onClick={handleDislikeClick}
              disabled={likeLoading || dislikeLoading}
              aria-busy={dislikeLoading}
              className="flex items-center text-white hover:opacity-80 transition-opacity disabled:opacity-60"
            >
              {dislikeLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <ThumbsDown
                  className={isDisliked ? 'fill-white' : ''}
                  strokeWidth={2}
                />
              )}
            </button>
          </Button>

          {/* Download Button */}
          <Button
            onClick={handleDownloadClick}
            variant="secondary"
            disabled={downloadLoading}
            aria-busy={downloadLoading}
          >
            <span className="inline-flex items-center gap-2 w-full">
              {downloadLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Download />
              )}
              Download
            </span>
          </Button>

          {/* Pro Badge (positioned absolutely if premium) */}
          {isPremium && (
            <Badge className="absolute -right-2 -top-2 bg-primary text-white px-2.5 py-0 rounded text-sm font-normal leading-snug">
              Pro
            </Badge>
          )}
        </div>
      </div>
    </div>
  )
}
