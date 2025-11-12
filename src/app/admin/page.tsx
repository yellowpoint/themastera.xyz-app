'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DataTableWithPagination } from '@/components/ui/data-table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getAllCategories, getAllLanguages } from '@/config/categories'
import type { Work } from '@/contracts/domain/work'
import { request } from '@/lib/request'
import type { ColumnDef } from '@tanstack/react-table'
import { useEffect, useMemo, useState, useRef } from 'react'
import { toast } from 'sonner'

type StatusOption = 'all' | 'draft' | 'published' | 'rejected'

const statusColors: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-600',
  published: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
}

export default function AdminPage() {
  const [items, setItems] = useState<Work[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState<number>(1)
  const [total, setTotal] = useState<number>(0)

  const [debouncedQ, setDebouncedQ] = useState('')
  const [q, setQ] = useState('')
  const [status, setStatus] = useState<StatusOption>('all')
  const [category, setCategory] = useState<string>('all')
  const [language, setLanguage] = useState<string>('all')
  const [quickPick, setQuickPick] = useState<'all' | 'yes' | 'no'>('all')
  const [pageSize, setPageSize] = useState<number>(20)
  const hasRunFiltersEffect = useRef(false)

  // Row-level action loading state
  type ActionType = 'publish' | 'reject' | 'mark_quick' | 'unmark_quick'
  const [rowActionLoading, setRowActionLoading] = useState<Record<string, ActionType | null>>({})
  const setRowLoading = (id: string, action: ActionType | null) => {
    setRowActionLoading((prev) => ({ ...prev, [id]: action }))
  }
  const isRowLoading = (id?: string, action?: ActionType) => {
    if (!id) return false
    const current = rowActionLoading[id]
    if (typeof action === 'string') return current === action
    return Boolean(current)
  }

  const categories = useMemo(() => getAllCategories(), [])
  const languages = useMemo(() => getAllLanguages(), [])

  const fetchWorks = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (debouncedQ.trim()) params.set('q', debouncedQ.trim())
      if (status && status !== 'all') params.set('status', status)
      if (category && category !== 'all') params.set('category', category)
      if (language && language !== 'all') params.set('language', language)
      if (quickPick && quickPick !== 'all') params.set('quickPick', quickPick)
      params.set('limit', String(pageSize))
      params.set('page', String(page))
      params.set('sortBy', 'createdAt')
      params.set('order', 'desc')

      const { data, ok } = await request.get(
        `/api/admin/works?${params.toString()}`
      )
      if (!ok || !data || (data as any).success === false) {
        const msg = (data as any)?.error?.message || 'Failed to fetch works'
        throw new Error(msg)
      }
      const items = (data as any)?.data?.items || []
      setItems(items)
      const pagination = (data as any)?.data?.pagination
      if (pagination && typeof pagination.total === 'number') {
        setTotal(pagination.total)
      }
    } catch (error: any) {
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  // Fetch when pagination changes
  useEffect(() => {
    fetchWorks()
  }, [page, pageSize])

  // When filters or debounced search change: if page !== 1, reset page to 1;
  // if already on page 1, fetch immediately. This avoids double requests.
  useEffect(() => {
    if (!hasRunFiltersEffect.current) {
      hasRunFiltersEffect.current = true
      return
    }
    if (page !== 1) {
      setPage(1)
    } else {
      fetchWorks()
    }
  }, [status, category, language, quickPick, debouncedQ])

  const handlePublish = async (work: Work) => {
    try {
      if (isRowLoading(work.id)) return
      setRowLoading(work.id, 'publish')
      const { data, ok } = await request.put(`/api/works/${work.id}`, {
        status: 'published',
      })
      if (!ok || !data || (data as any).success === false) {
        const msg = (data as any)?.error?.message || 'Failed to publish'
        throw new Error(msg)
      }
      toast.success('Published')
      setItems((prev) =>
        prev.map((w) => (w.id === work.id ? { ...w, status: 'published' } : w))
      )
    } catch (error: any) {
      console.error('Publish failed:', error)
      toast.error(error?.message || 'Publish failed')
    } finally {
      setRowLoading(work.id, null)
    }
  }

  const handleReject = async (work: Work) => {
    try {
      if (isRowLoading(work.id)) return
      setRowLoading(work.id, 'reject')
      const { data, ok } = await request.put(`/api/works/${work.id}`, {
        status: 'rejected',
      })
      if (!ok || !data || (data as any).success === false) {
        const msg = (data as any)?.error?.message || 'Failed to reject'
        throw new Error(msg)
      }
      toast.success('Marked as rejected')
      setItems((prev) =>
        prev.map((w) => (w.id === work.id ? { ...w, status: 'rejected' } : w))
      )
    } catch (error: any) {
      console.error('Reject failed:', error)
      toast.error(error?.message || 'Reject failed')
    } finally {
      setRowLoading(work.id, null)
    }
  }

  const handleToggleQuickPick = async (work: Work, value: boolean) => {
    try {
      if (isRowLoading(work.id)) return
      setRowLoading(work.id, value ? 'mark_quick' : 'unmark_quick')
      const { data, ok } = await request.put(`/api/works/${work.id}`, {
        quickPick: value,
      })
      if (!ok || !data || (data as any).success === false) {
        const msg =
          (data as any)?.error?.message || 'Failed to update Quick picks'
        throw new Error(msg)
      }
      toast.success(value ? 'Marked as Quick picks' : 'Unmarked Quick picks')
      setItems((prev) =>
        prev.map((w) => (w.id === work.id ? { ...w, quickPick: value } : w))
      )
    } catch (error: any) {
      console.error('Quick picks update failed:', error)
      toast.error(error?.message || 'Update failed')
    } finally {
      setRowLoading(work.id, null)
    }
  }

  const columns: ColumnDef<Work>[] = [
    {
      accessorKey: 'thumbnailUrl',
      header: 'Thumbnail',
      cell: ({ row }) => {
        const thumb = row.original.thumbnailUrl || '/thumbnail-placeholder.svg'
        return (
          <div className="w-16 h-10 border">
            {/* Use native img, not next/image */}
            <img
              src={thumb}
              alt={row.original.title || 'thumbnail'}
              className="w-full h-full object-cover rounded-sm"
            />
          </div>
        )
      },
      size: 100,
    },
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => (
        <div className="truncate max-w-[240px]" title={row.original.title}>
          {row.original.title || 'Untitled'}
        </div>
      ),
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row }) => <span>{row.original.category || '-'}</span>,
      size: 140,
    },
    {
      accessorKey: 'language',
      header: 'Language',
      cell: ({ row }) => <span>{row.original.language || '-'}</span>,
      size: 120,
    },
    {
      id: 'quickPick',
      header: 'Quick picks',
      cell: ({ row }) => {
        const work = row.original
        // Use only the boolean field quickPick
        const isQuick = Boolean(work.quickPick)
        return (
          <span className={isQuick ? 'text-green-700' : 'text-gray-600'}>
            {isQuick ? 'Yes' : 'No'}
          </span>
        )
      },
      size: 110,
    },
    {
      accessorKey: 'downloads',
      header: 'Downloads',
      cell: ({ row }) => <span>{row.original.downloads ?? 0}</span>,
      size: 100,
    },
    {
      accessorKey: 'views',
      header: 'Views',
      cell: ({ row }) => <span>{row.original.views ?? 0}</span>,
      size: 100,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const s = (row.original.status || 'draft').toLowerCase()
        const klass = statusColors[s] || 'bg-gray-100 text-gray-600'
        return <Badge className={`rounded-sm ${klass}`}>{s}</Badge>
      },
      size: 120,
    },
    {
      accessorKey: 'user',
      header: 'Author',
      cell: ({ row }) => {
        const u = row.original.user
        if (!u) return <span>-</span>
        return (
          <div className="flex items-center gap-2">
            {u.image ? (
              <img
                src={u.image || ''}
                alt={u.name || 'author'}
                className="w-6 h-6 rounded-full"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-gray-200" />
            )}
            <span className="text-sm">{u.name || 'User'}</span>
          </div>
        )
      },
      size: 180,
    },
    {
      accessorKey: 'createdAt',
      header: 'Created',
      cell: ({ row }) => {
        const created = row.original.createdAt
        const d = created ? new Date(created) : null
        return <span>{d ? d.toLocaleDateString('en-US') : '-'}</span>
      },
      size: 120,
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const work = row.original
        const canPublish = (work.status || 'draft') !== 'published'
        const loadingPublish = isRowLoading(work.id, 'publish')
        const loadingReject = isRowLoading(work.id, 'reject')
        const loadingMarkQuick = isRowLoading(work.id, 'mark_quick')
        const loadingUnmarkQuick = isRowLoading(work.id, 'unmark_quick')
        const anyLoading = isRowLoading(work.id)
        return (
          <div className="flex items-center justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="outline" disabled={anyLoading}>
                  {anyLoading ? 'Working...' : 'Actions'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  disabled={!canPublish || anyLoading}
                  onSelect={(e) => {
                    e.preventDefault()
                    handlePublish(work)
                  }}
                >
                  {loadingPublish ? 'Publishing…' : 'Publish'}
                </DropdownMenuItem>
                <DropdownMenuItem
                  disabled={anyLoading}
                  onSelect={(e) => {
                    e.preventDefault()
                    handleReject(work)
                  }}
                >
                  {loadingReject ? 'Rejecting…' : 'Reject'}
                </DropdownMenuItem>
                <DropdownMenuItem
                  disabled={Boolean(work.quickPick) || anyLoading}
                  onSelect={(e) => {
                    e.preventDefault()
                    handleToggleQuickPick(work, true)
                  }}
                >
                  {loadingMarkQuick ? 'Updating…' : 'Mark as Quick picks'}
                </DropdownMenuItem>
                <DropdownMenuItem
                  disabled={!Boolean(work.quickPick) || anyLoading}
                  onSelect={(e) => {
                    e.preventDefault()
                    handleToggleQuickPick(work, false)
                  }}
                >
                  {loadingUnmarkQuick ? 'Updating…' : 'Unmark Quick picks'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
      size: 160,
    },
  ]

  return (
    <div className="px-6 py-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold text-black">Admin – Works</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={fetchWorks} disabled={loading}>
            {loading ? 'Loading...' : 'Refresh'}
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-end gap-3 border rounded-sm p-3 mb-4 flex-wrap md:flex-nowrap">
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Search</label>
          <Input
            placeholder="Title, description, tags"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onDebouncedValueChange={(value) => {
              setDebouncedQ(value)
            }}
            className="w-[280px]"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Status</label>
          <Select
            value={status}
            onValueChange={(v) => setStatus(v as StatusOption)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Category</label>
          <Select value={category} onValueChange={(v) => setCategory(v)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Language</label>
          <Select value={language} onValueChange={(v) => setLanguage(v)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All languages" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {languages.map((lng) => (
                <SelectItem key={lng} value={lng}>
                  {lng}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Quick picks</label>
          <Select
            value={quickPick}
            onValueChange={(v) => setQuickPick(v as any)}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="yes">Yes</SelectItem>
              <SelectItem value="no">No</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Search is debounced automatically; manual button removed */}
      </div>

      <DataTableWithPagination
        columns={columns}
        data={items}
        loading={loading}
        initialPageSize={pageSize}
        serverPagination={{
          total,
          page,
          pageSize,
          onPageChange: (nextPage: number) => {
            setPage(nextPage)
          },
          onPageSizeChange: (size: number) => {
            setPageSize(size)
            setPage(1)
          },
        }}
      />
    </div>
  )
}
