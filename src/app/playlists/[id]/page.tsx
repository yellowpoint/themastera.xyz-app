'use client'

import SortSearchToolbar from '@/components/SortSearchToolbar'
import WorkCardList from '@/components/WorkCardList'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import type { PlaylistCard } from '@/contracts/domain/playlist'
import { formatDate } from '@/lib/format'
import { request } from '@/lib/request'
import { MoreHorizontal, Play } from 'lucide-react'
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
    <div className="mux-player-controls-none mx-auto max-w-6xl px-4 sm:px-6 py-8">
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
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-6">
              <div className="flex items-center gap-2">
                <div className="text-white font-normal text-[36px] leading-[45px]">
                  {playlist?.name || 'Playlist'}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={onPlayAll}
                  className="h-11 px-[18px] bg-[#2B36D9] text-white rounded-[6px]"
                >
                  <Play className="mr-2 h-5 w-5 text-white" />
                  Play all
                </Button>
                <Button
                  variant="secondary"
                  className="h-11 w-11 p-0 rounded-[4px] bg-[#F6F9FC1A] hover:bg-[#FFFFFF33]"
                >
                  <MoreHorizontal className="h-5 w-5 text-[#C9CDD4]" />
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-8 px-6 text-[14px] leading-[22px] text-[#86909C]">
              <div className="flex items-center">{featured?.author || '-'}</div>
              <div className="w-[1.5px] h-[13.5px] bg-[#C9CDD4]" />
              <div className="flex items-center">
                {filteredItems.length} Videos
              </div>
              <div className="w-[1.5px] h-[13.5px] bg-[#C9CDD4]" />
              <div className="flex items-center">
                Latest added: {latestUpdatedLabel?.replace('Updated ', '')}
              </div>
            </div>
          </div>

          <SortSearchToolbar
            sortAZ={sortAZ}
            onSortChange={setSortAZ}
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
            searchPlaceholder="Search the video name"
            className="gap-4"
          />

          <WorkCardList
            works={
              filteredItems.map((i) => ({
                id: i.id,
                title: i.title,
                thumbnailUrl: i.thumbnail || undefined,
                user: { name: i.author },
                createdAt: (i as any)?.createdAt,
              })) as any
            }
            columns={3}
            extraMenuItems={(work) => (
              <DropdownMenuItem
                onSelect={async (e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  await removeEntry(work.id)
                }}
                disabled={deletingWorkId === work.id}
              >
                Remove from playlist
              </DropdownMenuItem>
            )}
          />
        </div>
      )}
    </div>
  )
}
