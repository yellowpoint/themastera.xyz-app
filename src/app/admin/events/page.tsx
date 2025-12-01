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
import { request } from '@/lib/request'
import { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal, Plus } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

// Helper for status colors
const getStatusColor = (status: string) => {
  switch (status) {
    case 'Upcoming':
      return 'bg-blue-100 text-blue-700'
    case 'On viewing':
      return 'bg-green-100 text-green-700'
    case 'Ended':
      return 'bg-gray-100 text-gray-600'
    default:
      return 'bg-gray-100 text-gray-600'
  }
}

export default function AdminEventsPage() {
  const router = useRouter()
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [pageSize, setPageSize] = useState(20)

  const [q, setQ] = useState('')
  const [debouncedQ, setDebouncedQ] = useState('')
  const [status, setStatus] = useState('all')

  const hasRunFiltersEffect = useRef(false)

  const fetchEvents = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (debouncedQ) params.set('q', debouncedQ)
      if (status && status !== 'all') params.set('status', status)
      params.set('page', String(page))
      params.set('limit', String(pageSize))

      const { data } = await request.get(`/api/events?${params.toString()}`)
      if (data?.success) {
        setItems(data.data.items || [])
        setTotal(data.data.pagination?.total || 0)
      } else {
        toast.error(data?.error?.message || 'Failed to fetch events')
      }
    } catch (err: any) {
      console.error(err)
      toast.error('Failed to fetch events')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [page, pageSize])

  useEffect(() => {
    if (!hasRunFiltersEffect.current) {
      hasRunFiltersEffect.current = true
      return
    }
    if (page !== 1) {
      setPage(1)
    } else {
      fetchEvents()
    }
  }, [debouncedQ, status])

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQ(q)
    }, 500)
    return () => clearTimeout(handler)
  }, [q])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return
    try {
      const { data } = await request.delete(`/api/events/${id}`)
      if (data?.success) {
        toast.success('Event deleted')
        fetchEvents()
      } else {
        toast.error(data?.error?.message || 'Failed to delete event')
      }
    } catch (err) {
      toast.error('Failed to delete event')
    }
  }

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => (
        <span className="font-medium">{row.original.title}</span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <Badge
          variant="secondary"
          className={getStatusColor(row.original.status)}
        >
          {row.original.status}
        </Badge>
      ),
    },
    {
      accessorKey: 'artistName',
      header: 'Artist',
    },
    {
      accessorKey: 'period',
      header: 'Period',
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => router.push(`/admin/events/${row.original.id}`)}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDelete(row.original.id)}
                className="text-red-600"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Events</h1>

        <Link href="/admin/events/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Create Event
          </Button>
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm text-muted-foreground">Search</label>
          <Input
            placeholder="Search events..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-[280px]"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm text-muted-foreground">Status</label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="Upcoming">Upcoming</SelectItem>
              <SelectItem value="On viewing">On viewing</SelectItem>
              <SelectItem value="Ended">Ended</SelectItem>
            </SelectContent>
          </Select>
        </div>
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
          onPageChange: setPage,
          onPageSizeChange: (size) => {
            setPageSize(size)
            setPage(1)
          },
        }}
      />
    </div>
  )
}
