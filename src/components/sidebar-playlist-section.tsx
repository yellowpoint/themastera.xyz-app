'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { useAuth } from '@/hooks/useAuth'
import { request } from '@/lib/request'
import { PlayCircle, Plus, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

type PlaylistItem = {
  id: string
  title: string
  author: string
  thumbnail?: string | null
}

type Playlist = {
  id: string
  name: string
  items: PlaylistItem[]
}
export async function createPlaylistApi(name: string) {
  const { data } = await request.post('/api/playlists', { name: name.trim() })
  return data?.data as Playlist
}
export function SidebarPlaylistSection() {
  const { user } = useAuth()
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [currentPlayingId, setCurrentPlayingId] = useState<string | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [newName, setNewName] = useState('')
  const [creating, setCreating] = useState(false)
  const [autoplayEnabled, setAutoplayEnabled] = useState(false)
  const fetchPlaylists = useCallback(async () => {
    if (!user?.id) return
    setLoading(true)
    setError(null)
    try {
      const { data } = await request.get('/api/playlists')
      const list: Playlist[] = (data?.data?.items || []) as Playlist[]
      setPlaylists(list)
      setSelectedId((prev) => prev || list[0]?.id || null)
    } catch (e: any) {
      setError(e?.message || 'Failed to load playlists')
    } finally {
      setLoading(false)
    }
  }, [user?.id])

  // Initial fetch
  useEffect(() => {
    fetchPlaylists()
  }, [fetchPlaylists])

  // Load previously selected playlist from localStorage
  useEffect(() => {
    try {
      const saved =
        typeof window !== 'undefined'
          ? window.localStorage.getItem('selectedPlaylistId')
          : null
      if (saved) setSelectedId(saved)
      const ap =
        typeof window !== 'undefined'
          ? window.localStorage.getItem('autoplayPlaylistEnabled')
          : null
      setAutoplayEnabled(ap === '1')
    } catch (_) {
      // ignore storage errors
    }
  }, [])

  // Persist selected playlist id
  useEffect(() => {
    try {
      if (selectedId && typeof window !== 'undefined') {
        window.localStorage.setItem('selectedPlaylistId', selectedId)
      }
    } catch (_) {
      // ignore storage errors
    }
  }, [selectedId])

  // Refresh playlists when WorkCard emits an update
  useEffect(() => {
    const handler = () => {
      fetchPlaylists()
    }
    window.addEventListener('playlist:updated', handler as EventListener)
    return () => {
      window.removeEventListener('playlist:updated', handler as EventListener)
    }
  }, [fetchPlaylists])

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(
          'autoplayPlaylistEnabled',
          autoplayEnabled ? '1' : '0'
        )
      }
      if (autoplayEnabled && !selectedId) {
        let savedId: string | null = null
        if (typeof window !== 'undefined') {
          savedId = window.localStorage.getItem('selectedPlaylistId')
        }
        if (savedId) {
          setSelectedId(savedId)
        } else if (playlists.length > 0) {
          setSelectedId(playlists[0].id)
        }
      }
    } catch (_) {}
  }, [autoplayEnabled, playlists, selectedId])

  // Listen to global player events to know current playing work
  useEffect(() => {
    const handler = (e: Event) => {
      const ce = e as CustomEvent
      const id = ce?.detail?.workId || ce?.detail?.id
      if (typeof id === 'string') {
        setCurrentPlayingId(id)
      }
    }
    if (typeof window !== 'undefined') {
      window.addEventListener('player:now-playing', handler as EventListener)
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener(
          'player:now-playing',
          handler as EventListener
        )
      }
    }
  }, [])

  const selected = useMemo(
    () => playlists.find((p) => p.id === selectedId) || null,
    [playlists, selectedId]
  )

  const handleDeleteItem = useCallback(
    async (workId: string) => {
      if (!selectedId) return
      try {
        await request.delete(`/api/playlists/${selectedId}/entries`, { workId })
        // Optimistic update: remove item locally
        setPlaylists((prev) =>
          prev.map((pl) =>
            pl.id === selectedId
              ? { ...pl, items: pl.items.filter((i) => i.id !== workId) }
              : pl
          )
        )
        toast.success('Removed from playlist')
        if (typeof window !== 'undefined') {
          window.dispatchEvent(
            new CustomEvent('playlist:updated', {
              detail: { playlistId: selectedId, workId },
            })
          )
        }
      } catch (e: any) {
        toast.error(e?.message || 'Failed to remove item')
      }
    },
    [selectedId]
  )
  const onCreate = async () => {
    const name = newName.trim()
    if (!name) return
    setCreating(true)
    try {
      const { data } = await request.post('/api/playlists', {
        name,
      })
      const created: Playlist = data?.data as Playlist
      const updated = [created, ...playlists]
      setPlaylists(updated)
      setSelectedId(created.id)
      setCreateOpen(false)
      setNewName('')
      // Notify other parts of the app
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('playlist:updated', {
            detail: { playlistId: created.id },
          })
        )
      }
      toast.success('Playlist created')
    } catch (e: any) {
      setError(e?.message || 'Failed to create playlist')
      toast.error(e?.message || 'Failed to create playlist')
    } finally {
      setCreating(false)
    }
  }

  // Export a helper to create playlist for reuse in other pages

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Switch
            id="autoplay-toggle"
            checked={autoplayEnabled}
            onCheckedChange={(v) => setAutoplayEnabled(!!v)}
          />
          <Label htmlFor="autoplay-toggle">Autoplay next</Label>
        </div>
      </div>
      {autoplayEnabled ? (
        <>
          <div className="flex items-center gap-2 mb-3">
            <div>Playlist</div>
            {playlists.length > 0 ? (
              <Select
                value={selectedId || undefined}
                onValueChange={(val) => setSelectedId(val)}
              >
                <SelectTrigger className="h-9 w-full">
                  <SelectValue
                    placeholder="Select playlist"
                    className="truncate"
                  />
                </SelectTrigger>
                <SelectContent>
                  {playlists.map((pl) => (
                    <SelectItem key={pl.id} value={pl.id} className="truncate">
                      {pl.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : null}
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={() => setCreateOpen(true)}
            >
              <Plus className="size-5" />
            </Button>
          </div>

          {loading ? (
            <div className="text-sm text-muted-foreground">
              Loading playlists...
            </div>
          ) : playlists.length === 0 ? (
            <div className="rounded-lg border p-3">
              <div className="text-sm font-semibold mb-1">Your library</div>
              <div className="text-xs text-muted-foreground mb-3">
                Create your playlist
              </div>
              <Button className="w-full" onClick={() => setCreateOpen(true)}>
                Create Playlist
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="space-y-3">
                {selected?.items?.length ? (
                  selected.items.map((item) => (
                    <PlaylistRow
                      key={item.id}
                      item={item}
                      isPlaying={item.id === currentPlayingId}
                      onDelete={() => handleDeleteItem(item.id)}
                    />
                  ))
                ) : (
                  <div className="text-sm text-center text-muted-foreground">
                    This playlist is empty
                  </div>
                )}
              </div>
            </div>
          )}

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
                  onClick={onCreate}
                  disabled={!newName.trim() || creating}
                  loading={creating}
                >
                  Create
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      ) : null}
    </div>
  )
}

function PlaylistRow({
  item,
  isPlaying,
  onDelete,
}: {
  item: PlaylistItem
  isPlaying?: boolean
  onDelete?: () => void
}) {
  const router = useRouter()
  const href = `/content/${item.id}`

  const handleRowClick = () => {
    if (href) router.push(href)
  }

  return (
    <div
      className="flex items-center gap-3 rounded-md p-2 hover:bg-muted/30 cursor-pointer"
      onClick={handleRowClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') handleRowClick()
      }}
    >
      <div className="h-12 w-12  relative">
        <img
          className="w-full h-full object-contain mx-auto"
          src={item?.thumbnail || '/thumbnail-placeholder.svg'}
          alt={item.title}
        />
        {isPlaying ? (
          <div className="absolute w-full h-full inset-0 bg-black/50 flex items-center justify-center">
            <PlayCircle className="size-6 text-white" />
          </div>
        ) : null}
      </div>
      <div className="flex-1 min-w-0 leading-tight">
        <div className="text-lg truncate">{item.title}</div>
        <div className="text-sm text-muted-foreground">{item.author}</div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 text-red-700"
        onClick={(e) => {
          e.stopPropagation()
          onDelete?.()
        }}
        aria-label="Remove"
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  )
}
