'use client'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'

import { HeaderHeight } from '@/components/Header'
import { SidebarPlaylistSection } from '@/components/sidebar-playlist-section'
import SubscribeButton from '@/components/SubscribeButton'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from '@/components/ui/accordion'
import { Skeleton } from '@/components/ui/skeleton'
import VideoPlayer from '@/components/VideoPlayer'
import WorkCardList from '@/components/WorkCardList'
import { useAuth } from '@/hooks/useAuth'
import { formatDate, formatViews } from '@/lib/format'
import { request } from '@/lib/request'
import {
  AlertTriangle,
  Download,
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
      <div className="h-screen">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-0 h-full">
          <div className="md:col-span-3 h-full px-2 overflow-y-auto">
            <div className="space-y-4 mt-8">
              <Skeleton className="aspect-video rounded-xl" />
              <div className="flex items-center justify-between gap-4 px-6">
                <Skeleton className="h-6 w-2/3" />
                <div className="flex items-center gap-4">
                  <Skeleton className="h-10 w-28 rounded-md" />
                  <Skeleton className="h-10 w-28 rounded-md" />
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-6 h-full px-4 py-8 overflow-y-auto overflow-x-hidden">
            <div className="bg-[rgba(91,91,91,0.2)] rounded-lg p-3">
              <div className="flex items-center gap-3">
                <Skeleton className="w-8 h-8 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
              </div>
              <div className="mt-3">
                <Skeleton className="h-9 w-28 rounded-md" />
              </div>
            </div>

            <div className="bg-[rgba(91,91,91,0.2)] rounded-lg p-3">
              <Skeleton className="h-4 w-32" />
              <div className="mt-3 space-y-2">
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-3 w-1/3" />
                <Skeleton className="h-20 w-full rounded-md" />
              </div>
            </div>

            {user?.id && (
              <div className="bg-[rgba(91,91,91,0.2)] rounded-lg p-3">
                <Skeleton className="h-4 w-40" />
                <div className="mt-3 space-y-2">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
              </div>
            )}

            <div className="bg-[rgba(91,91,91,0.2)] rounded-lg p-3">
              <Skeleton className="h-4 w-24" />
              <div className="mt-3 space-y-3">
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
      </div>
    )
  }

  if (error || !work) {
    return (
      <div className="h-full flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="mb-3 flex items-center justify-center text-muted-foreground">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Unable to Load</h2>
          <p className="text-gray-500 mb-4">
            {error || 'Please try again later.'}
          </p>
          <Link href="/content">
            <Button variant="default">Browse Works</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div
      className="overflow-hidden"
      style={{ height: 'calc(100vh - ' + HeaderHeight + ')' }}
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-0 h-full relative">
        {/* Main Content Area */}
        <div className="md:col-span-3 h-full px-2 pb-6 overflow-hidden">
          <div className="flex justify-center">
            <VideoPlayer
              videoUrl={work.fileUrl}
              thumbnailUrl={work.thumbnailUrl}
              title={work.title}
              autoPlay={true}
              width={
                'min(100%, calc((100vh - ' +
                HeaderHeight +
                ' - 80px) * 16 / 9))'
              }
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
          </div>

          <div className="h-20 flex items-center justify-between gap-4 px-6">
            <h1 className="text-2xl truncate" title={work.title}>
              {work.title}
            </h1>
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
                  <span>{likesCount > 0 ? formatViews(likesCount) : 0}</span>
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
            </div>
          </div>
        </div>

        <div className="space-y-6 h-full px-4 pb-8 overflow-y-auto overflow-x-hidden">
          <div className="flex flex-col gap-6">
            <div className="bg-[rgba(91,91,91,0.2)] rounded-lg p-2">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <div className="pt-2">
                    <div className="size-8 rounded-full border-[0.8px] border-[#2B36D9] overflow-hidden">
                      <img
                        src={(work?.user?.image as any) || '/favicon.ico'}
                        alt="avatar"
                        className="size-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="text-white text-2xl leading-9">
                    {work?.user?.name || 'Unknown Artist'}
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="text-white text-sm">
                    {formatViews(authorFollowersCount)} subscribers
                  </div>
                  <div>
                    <SubscribeButton
                      userId={work?.user?.id}
                      isFollowing={isFollowing}
                      onChanged={() => handleFollow()}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[rgba(91,91,91,0.2)] rounded-lg p-2">
              <div className="flex items-center justify-between">
                <div className="text-muted-foreground text-sm">
                  Video Description
                </div>
              </div>
              <div className="mt-3 flex flex-col gap-3">
                <div className="text-[16px] leading-6 text-highlight">
                  Total Views: {formatViews(work.views ?? work.downloads)}
                </div>
                <div className="text-[16px] leading-6 text-highlight">
                  Date added:{' '}
                  {formatDate(work.uploadTime ?? work.createdAt, 'MM-DD-YYYY')}
                </div>
                <Accordion
                  type="single"
                  collapsible
                  className="w-full text-sm"
                  defaultValue="desc"
                >
                  <AccordionItem value="desc">
                    <AccordionContent>
                      <div className="text-sm text-secondary-foreground">
                        <p className="whitespace-pre-wrap">
                          {work?.description ||
                            'The creator has not added a description yet...'}
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>

            {user?.id && (
              <div className="bg-[rgba(91,91,91,0.2)] rounded-lg p-2">
                <SidebarPlaylistSection />
              </div>
            )}

            <div className="bg-[rgba(91,91,91,0.2)] rounded-lg p-2">
              <div className="text-muted-foreground mb-1">Suggested</div>
              <WorkCardList
                works={(relatedWorks || []).slice(0, 4)}
                columns={1}
                variant="cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
