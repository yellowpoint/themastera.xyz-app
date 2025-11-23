'use client'

import PlaylistCard from '@/components/PlaylistCard'
import { createPlaylistApi } from '@/components/sidebar-playlist-section'
import TopTabs from '@/components/TopTabs'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'

import SortSearchToolbar from '@/components/SortSearchToolbar'
import type { PlaylistCard as PlaylistCardContract } from '@/contracts/domain/playlist'
import type { HomepageItem } from '@/contracts/domain/work'
import { request } from '@/lib/request'
import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

import HeroImageCarousel from '@/components/HeroImageCarousel'
import { formatTimeAgo } from '@/lib/format'
import { toast } from 'sonner'

// Use shared contract types
type Playlist = PlaylistCardContract

export default function PlaylistsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = React.useState<'recommend' | 'mine'>(
    'recommend'
  )
  const [playlists, setPlaylists] = React.useState<Playlist[]>([])
  const [loading, setLoading] = React.useState(true)
  const [creating, setCreating] = React.useState(false)
  const [newName, setNewName] = React.useState('')
  const [deletingId, setDeletingId] = React.useState<string | null>(null)
  const [openDeleteId, setOpenDeleteId] = React.useState<string | null>(null)
  const [createOpen, setCreateOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState('')
  const [sortAZ, setSortAZ] = React.useState(false)
  const [recLoading, setRecLoading] = React.useState(true)
  const [recError, setRecError] = React.useState<string | null>(null)
  const [recommendItems, setRecommendItems] = React.useState<
    {
      id: string
      name: string
      description?: string
      coverUrl?: string
      list: HomepageItem[]
    }[]
  >([])
  const heroItems = React.useMemo(() => {
    return recommendItems.slice(0, 4)
  }, [recommendItems])

  const fetchPlaylists = React.useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await request.get<{ items: Playlist[] }>(
        '/api/playlists'
      )
      setPlaylists(data?.success ? data.data?.items || [] : [])
    } catch (err) {
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchRecommend = React.useCallback(async () => {
    setRecLoading(true)
    setRecError(null)
    try {
      const { data } = await request.get('/api/recommend')
      const items = (
        (data as any)?.success ? (data as any)?.data || [] : []
      ) as Array<{
        id: string
        name: string
        description?: string
        coverUrl?: string
        list: HomepageItem[]
      }>
      setRecommendItems(items)
    } catch (e: any) {
      setRecError(e?.message || 'Failed to load')
    } finally {
      setRecLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchPlaylists()
    fetchRecommend()
  }, [fetchPlaylists, fetchRecommend])

  const filteredPlaylists = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    let arr = playlists
    if (q) arr = arr.filter((p) => p.name.toLowerCase().includes(q))
    if (sortAZ) arr = [...arr].sort((a, b) => a.name.localeCompare(b.name))
    return arr
  }, [playlists, searchQuery, sortAZ])

  const filteredRecommendSections = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    let arr = recommendItems.slice(4)
    if (q) arr = arr.filter((s) => (s.name || '').toLowerCase().includes(q))
    if (sortAZ)
      arr = [...arr].sort((a, b) => (a.name || '').localeCompare(b.name || ''))
    return arr
  }, [recommendItems, searchQuery, sortAZ])

  const createPlaylist = async () => {
    const name = newName.trim()
    if (!name) return
    setCreating(true)
    try {
      const created = await createPlaylistApi(name)
      toast.success('Playlist created')
      setNewName('')
      setPlaylists((prev) => [created, ...prev])
      setCreateOpen(false)
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('playlist:updated', {
            detail: { playlistId: created.id },
          })
        )
      }
    } catch (err) {
      // handled by request
    } finally {
      setCreating(false)
    }
  }

  const deletePlaylist = async (id: string) => {
    setDeletingId(id)
    try {
      await request.delete(`/api/playlists/${id}`)
      toast.success('Playlist deleted')
      setPlaylists((prev) => prev.filter((p) => p.id !== id))
    } catch (err) {
      // handled by request
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Top fixed tabs */}
      <TopTabs
        tabs={[
          { key: 'recommend', label: 'Recommend list' },
          { key: 'mine', label: 'My playlist' },
        ]}
        activeKey={activeTab}
        onChange={(key) => setActiveTab(key as 'recommend' | 'mine')}
      />
      {/* <h1 className="text-4xl text-white mb-10">
        {activeTab === 'recommend' ? 'Recommend list' : 'My Playlists'}
      </h1> */}
      {activeTab === 'mine' && (
        <SortSearchToolbar
          sortAZ={sortAZ}
          onSortChange={setSortAZ}
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          searchPlaceholder="Search playlist name"
          showCreateButton={activeTab === 'mine'}
          onCreateClick={() => setCreateOpen(true)}
          className="mb-4"
        />
      )}

      {activeTab === 'recommend' ? (
        <div className="p-0">
          {recLoading ? (
            <div className="p-4 space-y-6">
              <Skeleton className="w-full aspect-video rounded-3xl" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <div key={idx} className="space-y-3">
                    <Skeleton className="h-40 w-full rounded-lg" />
                    <Skeleton className="h-5 w-2/3" />
                    <Skeleton className="h-4 w-1/3" />
                  </div>
                ))}
              </div>
            </div>
          ) : recError ? (
            <div className="p-6 text-sm text-muted-foreground">{recError}</div>
          ) : (
            <>
              {heroItems.length > 0 && (
                <HeroImageCarousel items={heroItems} className="mb-8" />
              )}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filteredRecommendSections.map((sec) => {
                  const thumbs = sec.list
                    .map((i) => i.thumbnailUrl || null)
                    .filter(Boolean) as string[]
                  const first = thumbs[0]
                  const coverSrcs = [
                    first || undefined,
                    thumbs[1] || first || undefined,
                    thumbs[2] || first || undefined,
                  ]
                  return (
                    <PlaylistCard
                      key={sec.id}
                      title={sec.name}
                      href={`/section?section=${sec.id}`}
                      coverSrcs={coverSrcs}
                      updatedLabel={`Updated: ${formatTimeAgo(
                        (sec.list[0] as any).updatedAt
                      )}`}
                    />
                  )
                })}
              </div>
            </>
          )}
        </div>
      ) : null}
      {activeTab === 'mine' ? (
        <div className="p-0">
          {loading ? (
            <div className="p-4 space-y-6">
              <div className="flex items-center gap-4">
                <Skeleton className="h-10 w-28" />
                <Skeleton className="h-10 w-28" />
                <Skeleton className="h-10 w-28" />
                <div className="ml-auto w-64">
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <div key={idx} className="space-y-3">
                    <Skeleton className="h-40 w-full rounded-lg" />
                    <Skeleton className="h-5 w-2/3" />
                    <Skeleton className="h-4 w-1/3" />
                  </div>
                ))}
              </div>
            </div>
          ) : filteredPlaylists.length === 0 ? (
            <div className="p-6">
              <div className="rounded-xl overflow-hidden">
                <div className="">
                  <div className="flex flex-col  items-center gap-4 w-40">
                    <button
                      type="button"
                      onClick={() => setCreateOpen(true)}
                      className="group size-40  rounded-xl   bg-[#F6F9FC1A] hover:bg-white/10 transition-colors flex items-center justify-center"
                    >
                      <Plus className="h-12 w-12 text-white/80 group-hover:text-white" />
                    </button>
                    <div className="text-white text-xl">
                      Create first playlist
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredPlaylists.map((pl) => {
                const thumbs = pl.items
                  .map((i) => i.thumbnail || null)
                  .filter(Boolean) as string[]
                const first = thumbs[0]
                const coverSrcs = [
                  first || undefined,
                  thumbs[1] || first || undefined,
                  thumbs[2] || first || undefined,
                ]
                return (
                  <div key={pl.id}>
                    <PlaylistCard
                      title={pl.name}
                      href={`/playlists/${pl.id}`}
                      coverSrcs={coverSrcs}
                      updatedLabel={`Updated: ${formatTimeAgo((pl as any).updatedAt)}`}
                      showMenu
                      onEdit={() => {
                        router.push(`/playlists/${pl.id}`)
                      }}
                      onDelete={() => setOpenDeleteId(pl.id)}
                    />
                    <AlertDialog
                      open={openDeleteId === pl.id}
                      onOpenChange={(open) =>
                        setOpenDeleteId(open ? pl.id : null)
                      }
                    >
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete playlist?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete the playlist and its
                            entries.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <Button
                            variant="destructive"
                            onClick={async () => {
                              await deletePlaylist(pl.id)
                              setOpenDeleteId(null)
                            }}
                            loading={deletingId === pl.id}
                            disabled={deletingId === pl.id}
                          >
                            Confirm
                          </Button>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      ) : null}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a new playlist</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Input
              placeholder="Playlist name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={createPlaylist}
              disabled={!newName.trim() || creating}
              loading={creating}
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
