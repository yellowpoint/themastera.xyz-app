'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { DataTableWithPagination } from '@/components/ui/data-table'
import {
  Dialog,
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

type User = {
  id: string
  name: string
  email: string
  emailVerified: boolean
  image: string | null
  createdAt: string
  updatedAt: string
  level: string
  points: number
  earnings: number
}

export default function AdminUsersPage() {
  const [items, setItems] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState<number>(1)
  const [total, setTotal] = useState<number>(0)
  const [pageSize, setPageSize] = useState<number>(20)

  const [q, setQ] = useState('')
  const [debouncedQ, setDebouncedQ] = useState('')
  const hasRunFiltersEffect = useRef(false)

  // Level update state
  const [isLevelDialogOpen, setIsLevelDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [newLevel, setNewLevel] = useState<string>('')
  const [isUpdatingLevel, setIsUpdatingLevel] = useState(false)

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (debouncedQ.trim()) params.set('q', debouncedQ.trim())
      params.set('limit', String(pageSize))
      params.set('page', String(page))

      const { data, ok } = await request.get(
        `/api/admin/users?${params.toString()}`
      )
      if (!ok || !data || (data as any).success === false) {
        const msg = (data as any)?.error?.message || 'Failed to fetch users'
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
      toast.error(error.message || 'Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }

  const handleLevelUpdate = async () => {
    if (!selectedUser || !newLevel) return

    setIsUpdatingLevel(true)
    try {
      const { data, ok } = await request.put('/api/admin/users', {
        userId: selectedUser.id,
        level: newLevel,
      })

      if (ok) {
        toast.success(`User level updated to ${newLevel}`)
        setItems((prev) =>
          prev.map((user) =>
            user.id === selectedUser.id ? { ...user, level: newLevel } : user
          )
        )
        setIsLevelDialogOpen(false)
      } else {
        const errorMsg =
          (data as any)?.error?.message || 'Failed to update level'
        toast.error(errorMsg)
      }
    } catch (error) {
      toast.error('An error occurred while updating level')
    } finally {
      setIsUpdatingLevel(false)
    }
  }

  const openLevelDialog = (user: User) => {
    setSelectedUser(user)
    setNewLevel(user.level)
    setIsLevelDialogOpen(true)
  }

  useEffect(() => {
    fetchUsers()
  }, [page, pageSize])

  useEffect(() => {
    if (!hasRunFiltersEffect.current) {
      hasRunFiltersEffect.current = true
      return
    }
    if (page !== 1) {
      setPage(1)
    } else {
      fetchUsers()
    }
  }, [debouncedQ])

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'image',
      header: 'Avatar',
      cell: ({ row }) => (
        <Avatar className="h-8 w-8">
          <AvatarImage src={row.original.image || ''} alt={row.original.name} />
          <AvatarFallback>
            {row.original.name?.charAt(0)?.toUpperCase()}
          </AvatarFallback>
        </Avatar>
      ),
      size: 60,
    },
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.original.name}</span>
          <span className="text-xs text-muted-foreground">
            {row.original.id}
          </span>
        </div>
      ),
    },
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
      accessorKey: 'emailVerified',
      header: 'Verified',
      cell: ({ row }) => {
        const verified = row.original.emailVerified
        return (
          <span
            className={
              verified ? 'text-green-600 font-medium' : 'text-gray-400'
            }
          >
            {verified ? 'Yes' : 'No'}
          </span>
        )
      },
      size: 100,
    },
    {
      accessorKey: 'level',
      header: 'Level',
      cell: ({ row }) => (
        <span className="px-2 py-1 bg-secondary rounded-md text-xs">
          {row.original.level}
        </span>
      ),
      size: 100,
    },
    {
      accessorKey: 'points',
      header: 'Points',
      cell: ({ row }) => row.original.points,
      size: 100,
    },
    {
      accessorKey: 'createdAt',
      header: 'Joined',
      cell: ({ row }) => {
        const d = row.original.createdAt
          ? new Date(row.original.createdAt)
          : null
        return <span>{d ? d.toLocaleDateString() : '-'}</span>
      },
      size: 140,
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const user = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => openLevelDialog(user)}>
                Change Level
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
      size: 100,
    },
  ]

  return (
    <div className="">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Admin – Users</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={fetchUsers} disabled={loading}>
            {loading ? 'Loading...' : 'Refresh'}
          </Button>
        </div>
      </div>

      <div className="flex items-end gap-3 border rounded-sm p-3 mb-4 flex-wrap md:flex-nowrap">
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Search</label>
          <Input
            placeholder="Name or email"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onDebouncedValueChange={(value) => setDebouncedQ(value)}
            className="w-[280px]"
          />
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

      <Dialog open={isLevelDialogOpen} onOpenChange={setIsLevelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change User Level</DialogTitle>
            <DialogDescription>
              Update the level for user{' '}
              <span className="font-medium">{selectedUser?.name}</span> (
              {selectedUser?.email}).
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="level" className="text-right">
                Level
              </Label>
              <Select value={newLevel} onValueChange={setNewLevel}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="User">User</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsLevelDialogOpen(false)}
              disabled={isUpdatingLevel}
            >
              Cancel
            </Button>
            <Button onClick={handleLevelUpdate} loading={isUpdatingLevel}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
