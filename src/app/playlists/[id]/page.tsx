'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import type { PlaylistCard } from '@/contracts/domain/playlist'
import { formatDate } from '@/lib/format'
import { request } from '@/lib/request'
import { ArrowLeft, MoreHorizontal, Play } from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { toast } from 'sonner'

type PlaylistDetail = PlaylistCard

export default function PlaylistDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()

  const [playlist, setPlaylist] = React.useState<PlaylistDetail | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [deletingWorkId, setDeletingWorkId] = React.useState<string | null>(
    null
  )
  const [sortAZ, setSortAZ] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState('')

  const playlistId = params?.id

  const fetchDetail = React.useCallback(async () => {
    if (!playlistId) return
    setLoading(true)
    try {
      const { data } = await request.get<PlaylistDetail>(
        `/api/playlists/${playlistId}`
      )
      setPlaylist(data?.success ? data.data : null)
    } catch (err) {
      // handled by request
    } finally {
      setLoading(false)
    }
  }, [playlistId])

  React.useEffect(() => {
    fetchDetail()
  }, [fetchDetail])

  const removeEntry = async (workId: string) => {
    if (!playlistId) return
    setDeletingWorkId(workId)
    try {
      await request.delete(`/api/playlists/${playlistId}/entries`, {
        workId,
      })
      toast.success('Removed from playlist')
      setPlaylist((prev) =>
        prev
          ? { ...prev, items: prev.items.filter((i) => i.id !== workId) }
          : prev
      )
    } catch (err) {
      // handled by request
    } finally {
      setDeletingWorkId(null)
    }
  }

  const filteredItems = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    let arr = playlist?.items || []
    if (q) arr = arr.filter((p) => (p.title || '').toLowerCase().includes(q))
    if (sortAZ)
      arr = [...arr].sort((a, b) =>
        (a.title || '').localeCompare(b.title || '')
      )
    return arr
  }, [playlist?.items, searchQuery, sortAZ])

  const featured = filteredItems[0]

  const latestUpdatedLabel = React.useMemo(() => {
    const d = playlist?.updatedAt
    if (!d) return null
    try {
      const date = new Date(d)
      const now = new Date()
      const diffMs = Math.max(0, now.getTime() - date.getTime())
      const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))
      if (days <= 0) return 'Updated today'
      if (days === 1) return 'Updated 1 day ago'
      return `Updated ${days} days ago`
    } catch {
      return `Updated ${formatDate(d, 'MM-DD-YYYY')}`
    }
  }, [playlist?.updatedAt])

  const onPlayAll = () => {
    if (!featured) return
    router.push(`/content/${featured.id}`)
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/playlists')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : !playlist || filteredItems.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No videos in this playlist</p>
        </Card>
      ) : (
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {playlist?.name || 'Playlist'}
            </h1>
            <div className="text-sm text-muted-foreground flex items-center gap-3">
              <span>{filteredItems.length} Videos</span>
              {latestUpdatedLabel ? <span>• {latestUpdatedLabel}</span> : null}
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden bg-muted">
            <div className="relative">
              <div className="aspect-video">
                <img
                  src={featured?.thumbnail || '/thumbnail-placeholder.svg'}
                  alt={featured?.title || 'Thumbnail'}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-x-0 bottom-0 px-4 py-3 bg-gradient-to-t from-black/60 to-transparent text-white">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="bg-black/60 text-white border-white/50"
                    >
                      Watch Free
                    </Badge>
                    <span className="font-medium truncate max-w-[40vw]">
                      {featured?.title || 'Untitled'}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    className="bg-primary text-primary-foreground"
                    onClick={onPlayAll}
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Play all
                  </Button>
                </div>
                <div className="text-xs text-white/80">
                  {featured?.author || '-'}
                </div>
                <div className="mt-2">
                  <Progress value={0} />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setSortAZ(false)}
              className={`rounded-lg h-7 px-3 text-sm ${!sortAZ ? 'bg-primary text-primary-foreground' : ''}`}
            >
              Recent added
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setSortAZ(true)}
              className={`rounded-lg h-7 px-3 text-sm ${sortAZ ? 'bg-primary text-primary-foreground' : ''}`}
            >
              A-Z
            </Button>
            <div className="relative w-80 max-w-full">
              <Input
                placeholder="Search the video name"
                className="pl-3"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div key={item.id} className="group">
                <Link href={`/content/${item.id}`} className="block">
                  <div className="relative mb-3">
                    <div className="aspect-video">
                      <img
                        src={item.thumbnail || '/thumbnail-placeholder.svg'}
                        alt={item.title || 'Thumbnail'}
                        className="w-full h-full object-cover rounded-xl"
                        loading="lazy"
                      />
                    </div>
                  </div>
                </Link>
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-base line-clamp-2">
                        {item.title || 'Untitled'}
                      </h3>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem asChild>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <button
                                  className="w-full text-left disabled:opacity-50"
                                  disabled={deletingWorkId === item.id}
                                >
                                  Remove from playlist
                                </button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Remove video?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will remove the video from the
                                    playlist.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => removeEntry(item.id)}
                                  >
                                    Confirm
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {item.author || '-'}
                    </div>
                    {playlist?.updatedAt ? (
                      <div className="text-xs text-muted-foreground">
                        Updated: {latestUpdatedLabel?.replace('Updated ', '')}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
