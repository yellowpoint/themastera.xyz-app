'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { Work } from '@/contracts/domain/work'
import { request } from '@/lib/request'
import React from 'react'
import { toast } from 'sonner'

export default function AdminQuickPicksPage() {
  const [items, setItems] = React.useState<Work[]>([])
  const [loading, setLoading] = React.useState(false)
  const [saving, setSaving] = React.useState(false)

  const fetchItems = async () => {
    setLoading(true)
    try {
      const { data, ok } = await request.get('/api/admin/quick-picks')
      if (!ok || !data || (data as any).success === false) {
        const msg =
          (data as any)?.error?.message || 'Failed to fetch quick picks'
        throw new Error(msg)
      }
      const arr = ((data as any)?.data?.items || []) as Work[]
      setItems(arr)
    } catch (e: any) {
      setItems([])
      toast.error(e?.message || 'Failed to fetch quick picks')
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    fetchItems()
  }, [])

  // Order is maintained via drag-and-drop followed by normalize()

  const normalize = (arr: Work[]) => {
    const sorted = [...arr]
    for (let i = 0; i < sorted.length; i++) {
      ;(sorted[i] as any).quickPickOrder = i + 1
    }
    return sorted
  }

  const handleNormalize = () => {
    setItems((prev) => normalize(prev))
  }

  const handleSave = async () => {
    try {
      if (saving) return
      setSaving(true)
      const payload = {
        items: items.map((w, idx) => ({
          id: w.id,
          order: Number(w.quickPickOrder ?? idx + 1),
        })),
      }
      const { data, ok } = await request.post('/api/admin/quick-picks', payload)
      if (!ok || !data || (data as any).success === false) {
        const msg = (data as any)?.error?.message || 'Failed to save order'
        throw new Error(msg)
      }
      toast.success('Order saved')
      fetchItems()
    } catch (e: any) {
      toast.error(e?.message || 'Failed to save order')
    } finally {
      setSaving(false)
    }
  }

  const dragState = React.useRef<{ from: number | null }>({ from: null })

  const onDragStart = (index: number) => {
    dragState.current.from = index
  }
  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }
  const onDrop = (toIndex: number) => {
    const fromIndex = dragState.current.from
    dragState.current.from = null
    if (fromIndex == null || fromIndex === toIndex) return
    setItems((prev) => {
      const next = [...prev]
      const [moved] = next.splice(fromIndex, 1)
      next.splice(toIndex, 0, moved)
      return normalize(next)
    })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">
          Admin – Quick Picks（操作后需点击右侧保存）
        </h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={fetchItems} disabled={loading}>
            {loading ? 'Loading...' : 'Refresh'}
          </Button>
          <Button
            variant="outline"
            onClick={handleNormalize}
            disabled={loading || saving}
          >
            Normalize Order
          </Button>
          <Button onClick={handleSave} disabled={loading || saving}>
            {saving ? 'Saving…' : 'Save Order'}
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <Card className="p-6">No Quick picks</Card>
      ) : (
        <div className="overflow-x-auto border rounded-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead className="w-16">Drag</TableHead>
                <TableHead className="w-[140px]">Thumbnail</TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="w-[220px]">Author</TableHead>
                {/* Order column removed */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((w, idx) => (
                <TableRow
                  key={w.id}
                  draggable
                  onDragStart={() => onDragStart(idx)}
                  onDragOver={onDragOver}
                  onDrop={() => onDrop(idx)}
                  className="cursor-grab"
                >
                  <TableCell className="text-muted-foreground">
                    {idx + 1}
                  </TableCell>
                  <TableCell>
                    <div className="h-8 w-8 flex items-center justify-center rounded bg-overlay">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="16"
                        height="16"
                        fill="currentColor"
                      >
                        <path d="M9 5h-2v2h2V5zm4 0h2v2h-2V5zM9 9H7v2h2V9zm4 0h2v2h-2V9zM9 13H7v2h2v-2zm4 0h2v2h-2v-2z" />
                      </svg>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="w-24 h-14 border rounded-sm overflow-hidden">
                      <img
                        src={w.thumbnailUrl || '/thumbnail-placeholder.svg'}
                        alt={w.title || 'thumbnail'}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div
                      className="truncate max-w-[400px]"
                      title={w.title || ''}
                    >
                      {w.title || 'Untitled'}
                    </div>
                  </TableCell>
                  <TableCell>
                    {w.user ? (
                      <div className="flex items-center gap-2">
                        <Avatar className="size-6">
                          <AvatarImage
                            src={w.user.image || ''}
                            alt={w.user.name || 'author'}
                          />
                          <AvatarFallback>
                            {(w.user.name || 'U').slice(0, 1)}
                          </AvatarFallback>
                        </Avatar>
                        <span
                          className="text-sm truncate max-w-[160px]"
                          title={w.user.name || ''}
                        >
                          {w.user.name || 'User'}
                        </span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  {/* Order input removed */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
