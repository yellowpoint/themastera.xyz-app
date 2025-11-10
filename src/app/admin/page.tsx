'use client'

import React, { useEffect, useMemo, useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { DataTableWithPagination } from '@/components/ui/data-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { request } from '@/lib/request'
import type { Work } from '@/contracts/domain/work'
import { getAllCategories, getAllLanguages } from '@/config/categories'
import { toast } from 'sonner'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

type StatusOption = 'all' | 'draft' | 'published' | 'rejected'

const statusColors: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-600',
  published: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
}

export default function AdminPage() {
  const [items, setItems] = useState<Work[]>([])
  const [loading, setLoading] = useState(false)

  // Filters
  const [q, setQ] = useState('')
  const [status, setStatus] = useState<StatusOption>('all')
  const [category, setCategory] = useState<string>('all')
  const [language, setLanguage] = useState<string>('all')
  const [quickPick, setQuickPick] = useState<'all' | 'yes' | 'no'>('all')
  const [pageSize, setPageSize] = useState<number>(20)

  const categories = useMemo(() => getAllCategories(), [])
  const languages = useMemo(() => getAllLanguages(), [])

  const fetchWorks = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (q.trim()) params.set('q', q.trim())
      if (status && status !== 'all') params.set('status', status)
      if (category && category !== 'all') params.set('category', category)
      if (language && language !== 'all') params.set('language', language)
      if (quickPick && quickPick !== 'all') params.set('quickPick', quickPick)
      params.set('limit', String(pageSize))
      params.set('page', '1')
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
    } catch (error: any) {
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWorks()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handlePublish = async (work: Work) => {
    try {
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
    }
  }

  const handleReject = async (work: Work) => {
    try {
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
    }
  }

  const handleToggleQuickPick = async (work: Work, value: boolean) => {
    try {
      const { data, ok } = await request.put(`/api/works/${work.id}`, {
        quickPick: value,
      })
      if (!ok || !data || (data as any).success === false) {
        const msg = (data as any)?.error?.message || 'Failed to update Quick picks'
        throw new Error(msg)
      }
      toast.success(value ? 'Marked as Quick picks' : 'Unmarked Quick picks')
      setItems((prev) =>
        prev.map((w) => (w.id === work.id ? { ...w, quickPick: value } : w))
      )
    } catch (error: any) {
      console.error('Quick picks update failed:', error)
      toast.error(error?.message || 'Update failed')
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
        <div className="truncate max-w-[240px]">
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
        return (
          <div className="flex items-center justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="outline">
                  Actions
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  disabled={!canPublish}
                  onSelect={(e) => {
                    e.preventDefault()
                    handlePublish(work)
                  }}
                >
                  Publish
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault()
                    handleReject(work)
                  }}
                >
                  Reject
                </DropdownMenuItem>
                <DropdownMenuItem
                  disabled={Boolean(work.quickPick)}
                  onSelect={(e) => {
                    e.preventDefault()
                    handleToggleQuickPick(work, true)
                  }}
                >
                  Mark as Quick picks
                </DropdownMenuItem>
                <DropdownMenuItem
                  disabled={!Boolean(work.quickPick)}
                  onSelect={(e) => {
                    e.preventDefault()
                    handleToggleQuickPick(work, false)
                  }}
                >
                  Unmark Quick picks
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
      <div className="flex flex-wrap items-end gap-3 border rounded-sm p-3 mb-4 ">
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Search</label>
          <Input
            placeholder="Title, description, tags"
            value={q}
            onChange={(e) => setQ(e.target.value)}
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
            <SelectTrigger className="w-[220px]">
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
        <Select value={quickPick} onValueChange={(v) => setQuickPick(v as any)}>
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

        <Button onClick={fetchWorks} className="ml-auto">
          Search
        </Button>
      </div>

      <DataTableWithPagination
        columns={columns}
        data={items}
        loading={loading}
        pageSizeOptions={[10, 20, 50, 100]}
        initialPageSize={pageSize}
      />
    </div>
  )
}
