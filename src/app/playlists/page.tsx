'use client'

import PlaylistCard from '@/components/PlaylistCard'
import { createPlaylistApi } from '@/components/sidebar-playlist-section'
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

import type { PlaylistCard as PlaylistCardContract } from '@/contracts/domain/playlist'
import type { HomepageItem } from '@/contracts/domain/work'
import { request } from '@/lib/request'
import { Plus, Search } from 'lucide-react'
import React from 'react'

import { formatDate } from '@/lib/format'
import { toast } from 'sonner'

// Use shared contract types
type Playlist = PlaylistCardContract

export default function PlaylistsPage() {
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
  const [sections, setSections] = React.useState<
    { id: string; title: string; items: HomepageItem[] }[]
  >([])

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
      const { data } = await request.get('/api/homepage')
      const secs = ((data as any)?.data?.sections || []) as Array<{
        id: string
        title: string
        items: HomepageItem[]
      }>
      setSections(secs)
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

  const filteredSections = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    let arr = sections
    if (q) arr = arr.filter((s) => s.title.toLowerCase().includes(q))
    if (sortAZ) arr = [...arr].sort((a, b) => a.title.localeCompare(b.title))
    return arr
  }, [sections, searchQuery, sortAZ])

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
      <div className="flex items-center justify-between gap-8 mb-6 fixed top-6 z-9999 left-1/2 -translate-x-1/2">
        <div className="relative flex items-center gap-8">
          {[
            { key: 'recommend', label: 'Recommend list' },
            { key: 'mine', label: 'My playlist' },
          ].map(({ key, label }) => (
            <div key={key} className="flex flex-col items-center">
              <button
                className={`${
                  activeTab === key ? 'text-white' : 'text-muted-foreground'
                } text-sm`}
                onClick={() => setActiveTab(key as any)}
              >
                {label}
              </button>
            </div>
          ))}
          {/* 底部高亮条：通过绝对定位跟随活跃项 */}
          <div
            className="absolute bottom-[-8px] h-1 w-12 rounded bg-primary transition-all duration-300"
            style={{
              left: activeTab === 'recommend' ? '20px' : '130px',
            }}
          />
        </div>
        <button
          className="text-white text-sm flex items-center gap-2"
          type="button"
        >
          Filter
        </button>
        <Button
          onClick={() => setCreateOpen(true)}
          variant="secondary"
          size="sm"
          className="bg-[#F6F9FC1A] hover:bg-[#FFFFFF44] h-6 text-sm"
        >
          <Plus className="size-4" />
          Create
        </Button>
      </div>
      <h1 className="text-4xl text-white mb-10">
        {activeTab === 'recommend' ? 'Recommend list' : 'My Playlists'}
      </h1>
      <div className="flex items-center gap-3 mb-4">
        <Button
          size="sm"
          variant="secondary"
          onClick={() => setSortAZ(false)}
          className={`rounded-lg h-7 px-3 text-sm ${!sortAZ ? 'bg-primary text-primary-foreground' : 'bg-white/10 text-white hover:bg-white/20'}`}
        >
          Recent added
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => setSortAZ(true)}
          className={`rounded-lg h-7 px-3 text-sm ${sortAZ ? 'bg-primary text-primary-foreground' : 'bg-white/10 text-white hover:bg-white/20'}`}
        >
          A-Z
        </Button>
        <div className="relative w-80">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search playlist name"
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      {activeTab === 'recommend' ? (
        <div className="p-0">
          {recLoading ? (
            <div className="p-4 space-y-2">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-40 w-full" />
            </div>
          ) : recError ? (
            <div className="p-6 text-sm text-muted-foreground">{recError}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
              {filteredSections.map((sec) => {
                const first = sec.items[0]
                const coverSrc = first?.thumbnailUrl || undefined
                return (
                  <PlaylistCard
                    key={sec.id}
                    title={sec.title}
                    href={`/section?section=${sec.id}`}
                    coverSrc={coverSrc}
                  />
                )
              })}
            </div>
          )}
        </div>
      ) : null}
      {activeTab === 'mine' ? (
        <div className="p-0">
          {loading ? (
            <div className="p-4 space-y-2">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-40 w-full" />
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
              {filteredPlaylists.map((pl) => {
                const cover = pl.items[0]
                const coverSrc = cover?.thumbnail || undefined
                return (
                  <div key={pl.id}>
                    <PlaylistCard
                      title={pl.name}
                      href={`/playlists/${pl.id}`}
                      coverSrc={coverSrc}
                      updatedLabel={`Updated: ${formatDate((pl as any).updatedAt)}`}
                      showMenu
                      onEdit={() => {
                        if (typeof window !== 'undefined') {
                          window.location.href = `/playlists/${pl.id}`
                        }
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
