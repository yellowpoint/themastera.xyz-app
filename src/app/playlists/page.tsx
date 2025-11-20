'use client'

import AuthRequired from '@/components/auth-required'
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
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'

import type { PlaylistCard } from '@/contracts/domain/playlist'
import type { HomepageItem } from '@/contracts/domain/work'
import { request } from '@/lib/request'
import { FolderOpen, Plus, Search, Trash2 } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import { toast } from 'sonner'

// Use shared contract types
type Playlist = PlaylistCard

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
    <AuthRequired protectedPrefixes={['/playlists']}>
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
        <div className="flex items-center gap-3 mb-4">
          <Badge
            variant="secondary"
            onClick={() => setSortAZ(false)}
            className={!sortAZ ? 'bg-primary text-primary-foreground' : ''}
          >
            Recent added
          </Badge>
          <Badge
            variant="secondary"
            onClick={() => setSortAZ(true)}
            className={sortAZ ? 'bg-primary text-primary-foreground' : ''}
          >
            A-Z
          </Badge>
          <div className="relative flex-1">
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
          <Card className="p-0">
            {recLoading ? (
              <div className="p-4 space-y-2">
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-40 w-full" />
              </div>
            ) : recError ? (
              <div className="p-6 text-sm text-muted-foreground">
                {recError}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                {filteredSections.map((sec) => (
                  <div
                    key={sec.id}
                    className="rounded-xl overflow-hidden border"
                  >
                    <div className="grid grid-cols-4 gap-px bg-black">
                      {Array.from({ length: 4 }).map((_, idx) => {
                        const it = sec.items[idx]
                        return (
                          <div key={idx} className="bg-black">
                            {it ? (
                              <Link
                                href={`/content/${it.id}`}
                                className="block"
                              >
                                <img
                                  src={
                                    it.thumbnailUrl ||
                                    '/thumbnail-placeholder.svg'
                                  }
                                  alt={it.title}
                                  className="w-full h-24 object-cover"
                                />
                              </Link>
                            ) : (
                              <div className="w-full h-24 bg-muted" />
                            )}
                          </div>
                        )
                      })}
                    </div>
                    <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-t from-black/60 to-black/20 text-white">
                      <div className="min-w-0">
                        <div className="text-sm truncate">{sec.title}</div>
                      </div>
                      <Link
                        href={
                          sec.items[0] ? `/content/${sec.items[0].id}` : '#'
                        }
                      >
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-white/10 text-white border-white/20"
                        >
                          <FolderOpen className="mr-2 h-4 w-4" />
                          View
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        ) : null}
        {activeTab === 'mine' ? (
          <Card className="p-0">
            {loading ? (
              <div className="p-4 space-y-2">
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-40 w-full" />
              </div>
            ) : filteredPlaylists.length === 0 ? (
              <div className="p-6 text-sm text-muted-foreground">
                No playlists yet
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                {filteredPlaylists.map((pl) => (
                  <div
                    key={pl.id}
                    className="rounded-xl overflow-hidden border"
                  >
                    <div className="grid grid-cols-4 gap-px bg-black">
                      {Array.from({ length: 4 }).map((_, idx) => {
                        const it = pl.items[idx]
                        return (
                          <div key={idx} className="bg-black">
                            {it ? (
                              <Link
                                href={`/content/${it.id}`}
                                className="block"
                              >
                                <img
                                  src={
                                    it.thumbnail || '/thumbnail-placeholder.svg'
                                  }
                                  alt={it.title}
                                  className="w-full h-24 object-cover"
                                />
                              </Link>
                            ) : (
                              <div className="w-full h-24 bg-muted" />
                            )}
                          </div>
                        )
                      })}
                    </div>
                    <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-t from-black/60 to-black/20 text-white">
                      <div className="min-w-0">
                        <div className="text-sm truncate">{pl.name}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link href={`/playlists/${pl.id}`}>
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-white/10 text-white border-white/20"
                          >
                            <FolderOpen className="mr-2 h-4 w-4" />
                            View
                          </Button>
                        </Link>
                        <AlertDialog
                          open={openDeleteId === pl.id}
                          onOpenChange={(open) =>
                            setOpenDeleteId(open ? pl.id : null)
                          }
                        >
                          <Button
                            variant="destructive"
                            size="sm"
                            disabled={deletingId === pl.id}
                            onClick={() => setOpenDeleteId(pl.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </Button>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Delete playlist?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete the playlist and
                                its entries.
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
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
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
    </AuthRequired>
  )
}
