'use client'
import { Button } from '@/components/ui/button'
import { DataTableWithPagination } from '@/components/ui/data-table'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { request } from '@/lib/request'
import type { ColumnDef } from '@tanstack/react-table'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

type BetaApplication = {
  id: string
  email: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  createdAt: string
  updatedAt: string
}

export default function AdminBetaApplicationsPage() {
  const [items, setItems] = useState<BetaApplication[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState<number>(1)
  const [total, setTotal] = useState<number>(0)
  const [pageSize, setPageSize] = useState<number>(20)

  const [q, setQ] = useState('')
  const [debouncedQ, setDebouncedQ] = useState('')
  const [status, setStatus] = useState<
    'all' | 'PENDING' | 'APPROVED' | 'REJECTED'
  >('all')
  const hasRunFiltersEffect = useRef(false)
  const [openAdd, setOpenAdd] = useState(false)
  const [addEmail, setAddEmail] = useState('')
  const [addStatus, setAddStatus] = useState<
    'PENDING' | 'APPROVED' | 'REJECTED'
  >('APPROVED')
  const [adding, setAdding] = useState(false)

  const fetchApplications = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (debouncedQ.trim()) params.set('q', debouncedQ.trim())
      if (status && status !== 'all') params.set('status', status)
      params.set('limit', String(pageSize))
      params.set('page', String(page))

      const { data, ok } = await request.get(
        `/api/admin/beta-applications?${params.toString()}`
      )
      if (!ok || !data || (data as any).success === false) {
        const msg =
          (data as any)?.error?.message || 'Failed to fetch applications'
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

  useEffect(() => {
    fetchApplications()
  }, [page, pageSize])

  useEffect(() => {
    if (!hasRunFiltersEffect.current) {
      hasRunFiltersEffect.current = true
      return
    }
    if (page !== 1) {
      setPage(1)
    } else {
      fetchApplications()
    }
  }, [status, debouncedQ])

  const updateStatus = async (
    app: BetaApplication,
    next: 'PENDING' | 'APPROVED' | 'REJECTED'
  ) => {
    try {
      const { data, ok } = await request.put(
        `/api/admin/beta-applications/${app.id}`,
        { status: next }
      )
      if (!ok || !data || (data as any).success === false) {
        const msg = (data as any)?.error?.message || 'Failed to update status'
        throw new Error(msg)
      }
      setItems((prev) =>
        prev.map((i) => (i.id === app.id ? { ...i, status: next } : i))
      )
      toast.success('Updated')
    } catch (error: any) {
      toast.error(error?.message || 'Update failed')
    }
  }

  const columns: ColumnDef<BetaApplication>[] = [
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => (
        <span className="truncate max-w-[260px]" title={row.original.email}>
          {row.original.email}
        </span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const s = row.original.status
        const klass =
          s === 'APPROVED'
            ? 'text-green-700'
            : s === 'REJECTED'
              ? 'text-red-700'
              : 'text-gray-700'
        return <span className={klass}>{s}</span>
      },
      size: 140,
    },
    {
      accessorKey: 'createdAt',
      header: 'Created',
      cell: ({ row }) => {
        const d = row.original.createdAt
          ? new Date(row.original.createdAt)
          : null
        return <span>{d ? d.toLocaleString('en-US') : '-'}</span>
      },
      size: 200,
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const app = row.original
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
                  disabled={app.status === 'APPROVED'}
                  onSelect={(e) => {
                    e.preventDefault()
                    updateStatus(app, 'APPROVED')
                  }}
                >
                  Approve
                </DropdownMenuItem>
                <DropdownMenuItem
                  disabled={app.status === 'REJECTED'}
                  onSelect={(e) => {
                    e.preventDefault()
                    updateStatus(app, 'REJECTED')
                  }}
                >
                  Reject
                </DropdownMenuItem>
                <DropdownMenuItem
                  disabled={app.status === 'PENDING'}
                  onSelect={(e) => {
                    e.preventDefault()
                    updateStatus(app, 'PENDING')
                  }}
                >
                  Set Pending
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
    <div className="">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Admin – Beta Applications</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={fetchApplications}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Refresh'}
          </Button>
          <Button onClick={() => setOpenAdd(true)}>Add Email</Button>
        </div>
      </div>

      <Dialog open={openAdd} onOpenChange={setOpenAdd}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Email</DialogTitle>
            <DialogDescription>
              Manually add or update a beta application.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="beta-email">Email</Label>
              <Input
                id="beta-email"
                placeholder="user@example.com"
                value={addEmail}
                onChange={(e) => setAddEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="beta-status">Status</Label>
              <Select
                value={addStatus}
                onValueChange={(v) => setAddStatus(v as any)}
              >
                <SelectTrigger id="beta-status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="APPROVED">APPROVED</SelectItem>
                  <SelectItem value="PENDING">PENDING</SelectItem>
                  <SelectItem value="REJECTED">REJECTED</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              onClick={async () => {
                if (!addEmail || !addEmail.includes('@')) {
                  toast.error('Invalid email')
                  return
                }
                setAdding(true)
                try {
                  const { data, ok } = await request.post(
                    '/api/admin/beta-applications',
                    {
                      email: addEmail,
                      status: addStatus,
                    }
                  )
                  if (!ok || !data || (data as any).success === false) {
                    const msg = (data as any)?.error?.message || 'Failed to add'
                    throw new Error(msg)
                  }
                  const item = (data as any).data as BetaApplication
                  setItems((prev) => {
                    const exists = prev.some((i) => i.id === item.id)
                    return exists
                      ? prev.map((i) => (i.id === item.id ? item : i))
                      : [item, ...prev]
                  })
                  setAddEmail('')
                  setOpenAdd(false)
                  toast.success('Added')
                } catch (error: any) {
                  toast.error(error?.message || 'Add failed')
                } finally {
                  setAdding(false)
                }
              }}
              disabled={adding}
            >
              {adding ? 'Adding...' : 'Add'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex items-end gap-3 border rounded-sm p-3 mb-4 flex-wrap md:flex-nowrap">
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Search</label>
          <Input
            placeholder="Email address"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onDebouncedValueChange={(value) => setDebouncedQ(value)}
            className="w-[280px]"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Status</label>
          <Select value={status} onValueChange={(v) => setStatus(v as any)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="PENDING">PENDING</SelectItem>
              <SelectItem value="APPROVED">APPROVED</SelectItem>
              <SelectItem value="REJECTED">REJECTED</SelectItem>
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
          onPageChange: (nextPage: number) => setPage(nextPage),
          onPageSizeChange: (size: number) => {
            setPageSize(size)
            setPage(1)
          },
        }}
      />
    </div>
  )
}
