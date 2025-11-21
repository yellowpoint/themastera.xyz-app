'use client'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'

import { SidebarPlaylistSection } from '@/components/sidebar-playlist-section'
import SubscribeButton from '@/components/SubscribeButton'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import VideoPlayer from '@/components/VideoPlayer'
import WorkCardList from '@/components/WorkCardList'
import { useAuth } from '@/hooks/useAuth'
import { formatDate, formatViews } from '@/lib/format'
import { request } from '@/lib/request'
import {
  AlertTriangle,
  ChevronLeft,
  Download,
  Frown,
  Loader2,
  ThumbsDown,
  ThumbsUp,
} from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function ContentDetailPage() {
  const params = useParams()
  const rawId = (params as any)?.id
  const workId: string = Array.isArray(rawId) ? rawId[0] : rawId || ''
  const router = useRouter()
  const { user } = useAuth()

  const [work, setWork] = useState(null)
  const [relatedWorks, setRelatedWorks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Interaction state
  const [isLiked, setIsLiked] = useState(false)
  const [isDisliked, setIsDisliked] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)
  const [likesCount, setLikesCount] = useState(0)
  const [dislikesCount, setDislikesCount] = useState(0)
  const [authorFollowersCount, setAuthorFollowersCount] = useState(0)

  const [likeLoading, setLikeLoading] = useState(false)
  const [dislikeLoading, setDislikeLoading] = useState(false)
  const [downloadLoading, setDownloadLoading] = useState(false)

  useEffect(() => {
    if (workId) {
      fetchWorkDetails()
      fetchRelatedWorks()
      // Announce currently playing work to sidebar
      try {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(
            new CustomEvent('player:now-playing', { detail: { workId } })
          )
        }
      } catch (_) {
        // ignore
      }
    }
  }, [workId])

  

  const handleDownload = async () => {
    try {
      if (!workId) return
      setDownloadLoading(true)
      toast.info('Preparing download...')
      // Trigger browser download via our API route
      const url = `/api/mux/download?workId=${encodeURIComponent(workId)}`
      // Use a temporary anchor to avoid interfering with SPA navigation state
      const a = document.createElement('a')
      a.href = url
      a.rel = 'noopener'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)

      // Best-effort increment downloads stat (ignore errors)
      try {
        await request.post('/api/works/stats', { workId, type: 'download' })
      } catch (e) {
        // silently ignore
      }
    } catch (err) {
      console.error('Download error:', err)
      toast.error('Download failed. Please try again later.')
    } finally {
      setDownloadLoading(false)
    }
  }

  const fetchWorkDetails = async () => {
    try {
      setLoading(true)
      setError(null)
      const { data } = await request.get(`/api/works/${workId}`)

      const { work, engagement, authorFollow } = data?.data || {}
      if (work) {
        setWork(work)

        // Increment view count after successfully loading work details
        try {
          await request.post(`/api/works/${workId}/views`)
        } catch (viewError) {
          console.error('Error incrementing view count:', viewError)
          // Don't show error to user for view count increment failure
        }

        // Record watch history (upsert latest viewed timestamp)
        // Only record history for logged-in users
        if (user?.id) {
          try {
            await request.post('/api/history', { workId })
          } catch (historyError) {
            // Do not block page on history errors
            console.error('Error recording watch history:', historyError)
          }
        }
      }
      if (engagement) {
        const { reaction, likesCount, dislikesCount } = engagement
        setIsLiked(reaction === 'like')
        setIsDisliked(reaction === 'dislike')
        if (typeof likesCount === 'number') setLikesCount(likesCount)
        if (typeof dislikesCount === 'number') setDislikesCount(dislikesCount)
      }
      if (authorFollow) {
        setIsFollowing(!!authorFollow.isFollowing)
        if (typeof authorFollow.followersCount === 'number') {
          setAuthorFollowersCount(authorFollow.followersCount)
        }
      }
    } catch (err) {
      console.error('Error fetching work details:', err)
      setError(err.message || 'Network error, please try again later')
    } finally {
      setLoading(false)
    }
  }

  const fetchRelatedWorks = async () => {
    try {
      const { data } = await request.get(
        `/api/works/trending?limit=4&exclude=${workId}`
      )
      setRelatedWorks((data as any)?.data?.items || [])
    } catch (err) {
      console.error('Error fetching related works:', err)
    }
  }

  // formatViews moved to shared module

  const handleLike = async () => {
    try {
      setLikeLoading(true)
      const action = isLiked ? 'unlike' : 'like'
      const { data } = await request.post(`/api/works/${workId}/engagement`, {
        action,
      })

      const { reaction, likesCount, dislikesCount } = data?.data || {}
      setIsLiked(reaction === 'like')
      setIsDisliked(reaction === 'dislike')
      if (typeof likesCount === 'number') setLikesCount(likesCount)
      if (typeof dislikesCount === 'number') setDislikesCount(dislikesCount)
    } catch (err) {
      console.error('Error updating like:', err)
    } finally {
      setLikeLoading(false)
    }
  }

  const handleDislike = async () => {
    try {
      setDislikeLoading(true)
      const action = isDisliked ? 'undislike' : 'dislike'
      const { data } = await request.post(`/api/works/${workId}/engagement`, {
        action,
      })
      const { reaction, likesCount, dislikesCount } = data?.data || {}
      setIsLiked(reaction === 'like')
      setIsDisliked(reaction === 'dislike')
      if (typeof likesCount === 'number') setLikesCount(likesCount)
      if (typeof dislikesCount === 'number') setDislikesCount(dislikesCount)
    } catch (err) {
      console.error('Error updating dislike:', err)
    } finally {
      setDislikeLoading(false)
    }
  }

  // 已移除作品关注逻辑（改为赞/踩相斥）

  const handleFollow = () => {
    const next = !isFollowing
    setIsFollowing(next)
    setAuthorFollowersCount((prev) => (next ? prev + 1 : Math.max(0, prev - 1)))
    toast.success(next ? 'Followed the creator' : 'Unfollowed the creator')
  }

  // Autoplay-next: navigate to the next item in selected playlist
  const handleEnded = async () => {
    try {
      let ap = null
      if (typeof window !== 'undefined') {
        ap = window.localStorage.getItem('autoplayPlaylistEnabled')
      }
      if (ap !== '1') return
      // Read selected playlist id from localStorage; fallback to first playlist
      let selectedPlaylistId: string | null = null
      if (typeof window !== 'undefined') {
        selectedPlaylistId = window.localStorage.getItem('selectedPlaylistId')
      }
      const { data } = await request.get('/api/playlists')
      if (!data?.success) return
      const pls = (data?.data?.items as any[]) || []
      const selected =
        (selectedPlaylistId
          ? pls.find((p) => p.id === selectedPlaylistId)
          : null) || pls[0]
      const items = selected?.items || []
      if (!items.length) return
      const idx = items.findIndex((i) => i.id === workId)
      let nextItem = null
      if (idx >= 0) {
        nextItem = items[idx + 1] || items[0]
      } else {
        nextItem = items[0] || null
      }
      if (nextItem?.id) {
        router.push(`/content/${nextItem.id}`)
      }
    } catch (e) {
      // silently ignore navigation errors
    }
  }

  if (loading) {
    return (
      <div className="h-full">
        <div className="px-4 py-6 h-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
            <div className="md:col-span-2 space-y-4">
              <Skeleton className="aspect-video rounded-xl" />
              <Skeleton className="h-8 w-3/4" />
              <div className="flex gap-4">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex gap-3">
                  <Skeleton className="w-32 h-20 rounded" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !work) {
    return (
      <div className="h-full bg-content-bg flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-4 flex items-center justify-center text-muted-foreground">
            {error?.includes('not found') || error?.includes('deleted') ? (
              <Frown className="w-12 h-12" />
            ) : (
              <AlertTriangle className="w-12 h-12" />
            )}
          </div>
          <h2 className="text-2xl font-bold mb-2">
            {error?.includes('not found') || error?.includes('deleted')
              ? 'Work Not Found'
              : 'Failed to Load'}
          </h2>
          <p className="text-gray-500 mb-6">
            {error || 'Could not find the requested work'}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/content">
              <Button variant="default">Browse Other Works</Button>
            </Link>

            <Link href="/">
              <Button variant="ghost">
                <span className="inline-flex items-center gap-2">
                  <ChevronLeft className="size-4" />
                  Home
                </span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full bg-content-bg overflow-hidden">
      <div className="h-full">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-0 h-full">
          {/* Main Content Area */}
          <div className="md:col-span-3 h-full px-2">
            <div className="mb-3">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <span className="inline-flex items-center gap-2">
                    <ChevronLeft className="size-4" />
                    Home
                  </span>
                </Button>
              </Link>
            </div>
            <VideoPlayer
              videoUrl={work.fileUrl}
              thumbnailUrl={work.thumbnailUrl}
              title={work.title}
              autoPlay={true}
              onPlay={() => {
                try {
                  if (typeof window !== 'undefined') {
                    window.dispatchEvent(
                      new CustomEvent('player:now-playing', {
                        detail: { workId },
                      })
                    )
                  }
                } catch (_) {}
              }}
              onEnded={handleEnded}
            />

            <div className="space-y-4 mt-4">
              <div className="flex items-center justify-between gap-4 px-6">
                <h1 className="text-2xl">{work.title}</h1>
                <div className="flex items-center gap-4 relative">
                  <Button
                    variant="secondary"
                    className="bg-[#FFFFFF33] hover:bg-[#FFFFFF44]"
                  >
                    <button
                      onClick={handleLike}
                      disabled={likeLoading || dislikeLoading}
                      aria-busy={likeLoading}
                      className="flex items-center gap-2.5 text-white hover:opacity-80 transition-opacity disabled:opacity-60"
                    >
                      {likeLoading ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        <ThumbsUp className={isLiked ? 'fill-white' : ''} />
                      )}
                      <span>
                        {likesCount > 0 ? formatViews(likesCount) : 0}
                      </span>
                    </button>
                    <div
                      className="w-0 h-8 border-l-2 border-dashed opacity-20"
                      style={{ borderColor: '#F2F3F5' }}
                    />
                    <button
                      onClick={handleDislike}
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
                  <Button
                    onClick={handleDownload}
                    variant="secondary"
                    className="bg-[#FFFFFF33] hover:bg-[#FFFFFF44]"
                    disabled={downloadLoading}
                    aria-busy={downloadLoading}
                  >
                    <span className="inline-flex items-center gap-2 w-full">
                      {downloadLoading ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        <>
                          <Download />
                          Download
                        </>
                      )}
                    </span>
                  </Button>
                  {work.price && work.price > 0 ? (
                    <Badge className="absolute -right-2 -top-2 bg-primary text-white px-2.5 py-0 rounded text-sm font-normal leading-snug">
                      Pro
                    </Badge>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6 h-full px-4 overflow-y-auto overflow-x-hidden bg-white/10 backdrop-blur-md">
            <div className="space-y-3">
              <div className="flex flex-col">
                <p className="text-2xl">
                  {work?.user?.name || 'Unknown Artist'}
                </p>
                <p className="text-sm">
                  {formatViews(authorFollowersCount)} subscribers
                </p>
              </div>
              <SubscribeButton
                size="sm"
                userId={work?.user?.id}
                isFollowing={isFollowing}
                onChanged={() => handleFollow()}
              />
            </div>

            <div className="">
              <div className="">
                <p className="text-muted-foreground">Video Description</p>
                <div className="text-highlight">
                  <p>
                    Total Views: {formatViews(work.views ?? work.downloads)}
                  </p>
                  <p>
                    Date added:{' '}
                    {formatDate(
                      work.uploadTime ?? work.createdAt,
                      'MM-DD-YYYY'
                    )}
                  </p>
                </div>
              </div>
              <Accordion
                type="single"
                collapsible
                className="w-full mt-3 text-sm"
                defaultValue="desc"
              >
                <AccordionItem value="desc">
                  <AccordionContent>
                    <div className={`text-sm text-secondary-foreground`}>
                      <p className="whitespace-pre-wrap">
                        {work?.description ||
                          'The creator has not added a description yet...'}
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            {user?.id && <SidebarPlaylistSection />}

            <div>
              <div className="text-muted-foreground">Suggested</div>
              <WorkCardList
                works={(relatedWorks || []).slice(0, 4)}
                columns={1}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
