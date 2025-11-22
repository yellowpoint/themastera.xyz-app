'use client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Work } from '@/contracts/domain/work'
import { useAuth } from '@/hooks/useAuth'
import { formatTimeAgo, formatViews } from '@/lib/format'
import { request } from '@/lib/request'
import { ListPlus, Loader2, MoreVertical } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useCallback, useRef, useState } from 'react'
import { toast } from 'sonner'
import { Button } from './ui/button'

type PlaylistSummary = { id: string; name: string }

function formatTime(seconds?: number): string {
  if (!Number.isFinite(Number(seconds))) return '0:00'
  const s = Math.max(0, Math.round(Number(seconds)))
  const mins = Math.floor(s / 60)
  const secs = Math.floor(s % 60)
  return `${mins}:${String(secs).padStart(2, '0')}`
}

type WorkCardProps = {
  work: Work
  resolveThumb?: (url?: string | null) => string
  handleImgError?: (
    url?: string | null,
    e?: React.SyntheticEvent<HTMLImageElement, Event>
  ) => void
  formatViews?: (n: number) => string
  variant?: 'card' | 'simple' | 'cover'
}

export default function WorkCard({ work, variant = 'card' }: WorkCardProps) {
  const brokenThumbsRef = useRef<Set<string>>(new Set())
  const [playlists, setPlaylists] = useState<PlaylistSummary[]>([])
  const [loadingPlaylists, setLoadingPlaylists] = useState<boolean>(false)
  const [addingPlaylistId, setAddingPlaylistId] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState<boolean>(false)
  const router = useRouter()
  const { user } = useAuth()

  const fetchPlaylists = useCallback(async () => {
    if (loadingPlaylists) return
    setLoadingPlaylists(true)
    try {
      const { data } = await request.get<{ items: PlaylistSummary[] }>(
        '/api/playlists'
      )
      const list = (data?.data?.items || []) as PlaylistSummary[]
      setPlaylists(list)
    } catch (_) {
      // errors are handled by request
    } finally {
      setLoadingPlaylists(false)
    }
  }, [loadingPlaylists])

  const addToPlaylist = useCallback(
    async (playlistId: string) => {
      try {
        await request.post(`/api/playlists/${playlistId}/entries`, {
          workId: work?.id,
        })
        toast.success('Added to playlist')
        if (typeof window !== 'undefined') {
          window.dispatchEvent(
            new CustomEvent('playlist:updated', {
              detail: { playlistId, workId: work?.id },
            })
          )
        }
      } catch (err: any) {
        if (err?.message) toast.error(err.message)
      }
    },
    [work?.id]
  )

  const resolveThumb = (url?: string | null) => {
    if (!url) return '/thumbnail-placeholder.svg'
    return brokenThumbsRef.current.has(url) ? '/thumbnail-placeholder.svg' : url
  }

  const handleImgError = (
    url?: string | null,
    e?: React.SyntheticEvent<HTMLImageElement>
  ) => {
    if (!url || !e) return
    brokenThumbsRef.current.add(url)
    const target = e.currentTarget
    target.onerror = null
    target.src = '/thumbnail-placeholder.svg'
  }

  const viewsCount =
    typeof work?.views === 'number'
      ? work.views
      : typeof work?.downloads === 'number'
        ? work.downloads!
        : 0

  const durationLabel = work?.duration
    ? work.duration
    : work?.durationSeconds
      ? formatTime(work.durationSeconds)
      : '0:00'

  const goToUser = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      const id = work?.user?.id
      if (id) router.push(`/user/${id}`)
    },
    [router, work?.user?.id]
  )

  if (variant === 'simple') {
    return (
      <div
        className="group cursor-pointer rounded-xl"
        onClick={() => {
          router.push(`/content/${work?.id}`)
        }}
      >
        <div className="flex items-center gap-3 px-1 py-1">
          <img
            src={resolveThumb(work?.thumbnailUrl)}
            alt={work?.title || 'Untitled'}
            className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
            loading="lazy"
            onError={(e) => handleImgError(work?.thumbnailUrl, e)}
          />
          <div className="flex-1 min-w-0">
            <div className="text-base font-medium truncate">
              {work?.title || 'Untitled'}
            </div>
            <div
              className="text-sm text-muted-foreground truncate hover:underline"
              onClick={goToUser}
            >
              {work?.user?.name || 'Unknown Creator'}
            </div>
          </div>
          {user ? (
            <div className="flex-shrink-0" onClick={(e) => e.stopPropagation()}>
              <DropdownMenu
                open={menuOpen}
                onOpenChange={(open) => {
                  setMenuOpen(open)
                  if (open && playlists.length === 0) fetchPlaylists()
                }}
              >
                <DropdownMenuTrigger asChild>
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    className="text-muted-foreground hover:text-foreground"
                    aria-label="More"
                    type="button"
                    onClick={(e) => e.stopPropagation()}
                    disabled={!!addingPlaylistId}
                  >
                    <MoreVertical size={18} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" sideOffset={6}>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <ListPlus className="size-4" />
                      <span>Add to playlist</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      {loadingPlaylists ? (
                        <DropdownMenuItem disabled>Loading...</DropdownMenuItem>
                      ) : playlists.length > 0 ? (
                        playlists.map((pl) => (
                          <DropdownMenuItem
                            key={pl.id}
                            disabled={
                              !!addingPlaylistId && addingPlaylistId !== pl.id
                            }
                            onSelect={async (e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              if (addingPlaylistId) return
                              setAddingPlaylistId(pl.id)
                              try {
                                await addToPlaylist(pl.id)
                                setMenuOpen(false)
                              } finally {
                                setAddingPlaylistId(null)
                              }
                            }}
                          >
                            <div className="flex items-center gap-2">
                              {addingPlaylistId === pl.id ? (
                                <Loader2 className="size-4 animate-spin" />
                              ) : null}
                              <span>{pl.name}</span>
                            </div>
                          </DropdownMenuItem>
                        ))
                      ) : (
                        <DropdownMenuItem disabled>
                          No playlists
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : null}
        </div>
      </div>
    )
  }

  if (variant === 'cover') {
    return (
      <div
        className="group cursor-pointer rounded-xl"
        onClick={() => {
          router.push(`/content/${work?.id}`)
        }}
      >
        <div className="relative w-full h-14 rounded-xl overflow-hidden">
          <img
            src={resolveThumb(work?.thumbnailUrl)}
            alt={work?.title || 'Untitled'}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
            onError={(e) => handleImgError(work?.thumbnailUrl, e)}
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex items-center">
            <div className="px-4">
              <div className="text-white truncate hover:underline">
                {work?.title || 'Untitled'}
              </div>
              <div
                className="text-white/80 text-sm truncate hover:underline"
                onClick={goToUser}
              >
                {work?.user?.name || 'Unknown Creator'}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="group cursor-pointer block"
      onClick={() => {
        router.push(`/content/${work?.id}`)
      }}
    >
      <div className="relative mb-3">
        <div className=" relative bg-background rounded-xl overflow-hidden ">
          <img
            src={resolveThumb(work?.thumbnailUrl)}
            alt={work?.title || 'Untitled'}
            className="aspect-video w-full rounded-lg object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            onError={(e) => handleImgError(work?.thumbnailUrl, e)}
          />
          <div className="absolute bottom-2 left-2 bg-[#1D2129CC] text-white text-xs px-2 py-1 rounded-sm">
            {formatViews(viewsCount)} views
          </div>
          <div className="absolute bottom-2 right-2 bg-[#1D2129CC] text-white text-xs px-2 py-1 rounded-sm">
            {durationLabel}
          </div>
        </div>
        <div className="absolute inset-0 bg-black/10  dark:bg-white/10 opacity-0 group-hover:opacity-100 scale-90 flex items-center justify-center rounded-xl overflow-hidden group-hover:scale-105 transition-all pointer-events-none"></div>
        <div className="flex items-center gap-3 mt-3">
          <div className="flex-shrink-0">
            <Avatar className="size-10 cursor-pointer" onClick={goToUser}>
              <AvatarImage src={work?.user?.image || undefined} />
              <AvatarFallback>
                {work?.user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xl truncate">{work?.title}</h3>
            <p
              className="text-sm text-muted-foreground truncate hover:underline"
              onClick={goToUser}
            >
              {work?.user?.name || 'Unknown Creator'}
            </p>
            {work?.createdAt && (
              <p className="text-xs text-muted-foreground mt-1">
                Updated: {formatTimeAgo(work.createdAt)}
              </p>
            )}
          </div>
          {user ? (
            <div
              className="flex-shrink-0 self-start"
              onClick={(e) => e.stopPropagation()}
            >
              <DropdownMenu
                open={menuOpen}
                onOpenChange={(open) => {
                  setMenuOpen(open)
                  if (open && playlists.length === 0) fetchPlaylists()
                }}
              >
                <DropdownMenuTrigger asChild>
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    className="text-muted-foreground hover:text-foreground flex-shrink-0"
                    aria-label="More"
                    type="button"
                    onClick={(e) => e.stopPropagation()}
                    disabled={!!addingPlaylistId}
                  >
                    <MoreVertical size={18} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" sideOffset={6}>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <ListPlus className="size-4" />
                      <span>Add to playlist</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      {loadingPlaylists ? (
                        <DropdownMenuItem disabled>Loading...</DropdownMenuItem>
                      ) : playlists.length > 0 ? (
                        playlists.map((pl) => (
                          <DropdownMenuItem
                            key={pl.id}
                            disabled={
                              !!addingPlaylistId && addingPlaylistId !== pl.id
                            }
                            onSelect={async (e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              if (addingPlaylistId) return
                              setAddingPlaylistId(pl.id)
                              try {
                                await addToPlaylist(pl.id)
                                setMenuOpen(false)
                              } finally {
                                setAddingPlaylistId(null)
                              }
                            }}
                          >
                            <div className="flex items-center gap-2">
                              {addingPlaylistId === pl.id ? (
                                <Loader2 className="size-4 animate-spin" />
                              ) : null}
                              <span>{pl.name}</span>
                            </div>
                          </DropdownMenuItem>
                        ))
                      ) : (
                        <DropdownMenuItem disabled>
                          No playlists
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
