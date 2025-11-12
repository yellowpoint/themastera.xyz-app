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
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { PlaylistCard } from '@/contracts/domain/playlist'
import { api as request } from '@/lib/request'
import { FolderOpen, Plus, Search, Trash2 } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import { toast } from 'sonner'

// Use shared contract types
type Playlist = PlaylistCard

export default function PlaylistsPage() {
  const [playlists, setPlaylists] = React.useState<Playlist[]>([])
  const [loading, setLoading] = React.useState(true)
  const [creating, setCreating] = React.useState(false)
  const [newName, setNewName] = React.useState('')
  const [deletingId, setDeletingId] = React.useState<string | null>(null)
  const [openDeleteId, setOpenDeleteId] = React.useState<string | null>(null)
  const [createOpen, setCreateOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState('')

  const fetchPlaylists = React.useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await request.get<{ items: Playlist[] }>(
        '/api/playlists'
      )
      setPlaylists(data?.success ? data.data?.items || [] : [])
    } catch (err) {
      // Errors handled by request helper
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchPlaylists()
  }, [fetchPlaylists])

  const filteredPlaylists = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return playlists
    return playlists.filter((p) => p.name.toLowerCase().includes(q))
  }, [playlists, searchQuery])

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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Playlists</h1>
        </div>

        <Card className="p-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search playlists"
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button onClick={() => setCreateOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create
            </Button>
          </div>
        </Card>

        <Card className="p-0 overflow-hidden">
          {loading && (
            <div className="p-4 space-y-2">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          )}
          {!loading && filteredPlaylists.length === 0 && (
            <div className="p-8">
              <Empty>
                <EmptyHeader>
                  <EmptyTitle>No playlists yet</EmptyTitle>
                  <EmptyDescription>
                    Create your first playlist to start organizing your videos
                  </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  <Button onClick={() => setCreateOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Playlist
                  </Button>
                </EmptyContent>
              </Empty>
            </div>
          )}
          {!loading && filteredPlaylists.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPlaylists.length > 0 &&
                  filteredPlaylists.map((pl) => (
                    <TableRow key={pl.id}>
                      <TableCell className="font-medium">
                        <Link
                          href={`/playlists/${pl.id}`}
                          className="hover:underline"
                        >
                          {pl.name}
                        </Link>
                      </TableCell>
                      <TableCell>{pl.items?.length ?? 0}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/playlists/${pl.id}`}>
                            <Button variant="outline" size="sm">
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
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          )}
        </Card>

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
