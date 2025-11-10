'use client'

import { useState, useEffect, useCallback } from 'react'
import { Search, MoreHorizontal } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useWorks } from '@/hooks/useWorks'
import { useRouter } from 'next/navigation'
// import { toast } from "sonner";

// shadcn/ui components
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DataTableWithPagination } from '@/components/ui/data-table'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  EmptyMedia,
} from '@/components/ui/empty'
import { useCreatorColumns } from './columns'

import type { Work } from '@/contracts/domain/work'

export default function CreatorPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { works, loading: worksLoading, deleteWork, fetchWorks } = useWorks()
  const [searchQuery, setSearchQuery] = useState<string>('')
  // debounce search to avoid excessive requests
  const [debouncedSearch, setDebouncedSearch] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(10)
  const [total, setTotal] = useState<number>(0)

  const columns = useCreatorColumns()

  // Server-side fetching based on filters and pagination
  const loadWorks = useCallback(async () => {
    const res = await fetchWorks({
      status: statusFilter !== 'all' ? statusFilter : undefined,
      q: debouncedSearch || undefined,
      page,
      limit,
    })
    const pagination = (res as any)?.data?.pagination
    if (pagination) {
      setTotal(pagination.total || 0)
    }
  }, [fetchWorks, statusFilter, debouncedSearch, page, limit])

  // formatters moved to shared module

  useEffect(() => {
    const onDeleted = () => {
      loadWorks()
    }
    window.addEventListener('work-deleted', onDeleted as EventListener)
    return () =>
      window.removeEventListener('work-deleted', onDeleted as EventListener)
  }, [loadWorks])

  // Trigger load on filter/pagination changes
  useEffect(() => {
    loadWorks()
  }, [loadWorks])

  // Update debounced search term
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(searchQuery)
    }, 300)
    return () => clearTimeout(t)
  }, [searchQuery])

  // Reset to first page when filters change
  useEffect(() => {
    setPage(1)
  }, [statusFilter, debouncedSearch])

  return (
    <div className="h-full">
      <div className="">
        <div className="max-w-7xl mx-auto px-8 py-6">
          {/* Page Title */}
          <div className="mb-10">
            <h1 className="text-2xl font-normal">Dashboard</h1>
          </div>

          <div className="space-y-6">
            {/* Search and Filter */}
            <div className="flex gap-4">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search for video name"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 border-gray-300"
                  disabled={worksLoading}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40 border-gray-300" disabled={worksLoading}>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {works.length === 0 && !worksLoading ? (
              <Empty className="border-gray-200">
                <EmptyHeader>
                  <EmptyTitle>
                    {searchQuery || statusFilter !== 'all'
                      ? 'No results found'
                      : 'No works yet'}
                  </EmptyTitle>
                  <EmptyDescription>
                    {searchQuery || statusFilter !== 'all'
                      ? 'Try adjusting filters or changing your search.'
                      : 'Upload your first video to get started.'}
                  </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  {searchQuery || statusFilter !== 'all' ? (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchQuery('')
                        setStatusFilter('all')
                        setPage(1)
                        setLimit(10)
                      }}
                    >
                      Reset filters
                    </Button>
                  ) : (
                    <Button onClick={() => router.push('/creator/upload')}>
                      Upload video
                    </Button>
                  )}
                </EmptyContent>
              </Empty>
            ) : (
              <DataTableWithPagination
                columns={columns}
                data={works}
                loading={worksLoading}
                initialPageSize={limit}
                serverPagination={{
                  total,
                  page,
                  pageSize: limit,
                  onPageChange: (nextPage) => {
                    setPage(nextPage)
                  },
                  onPageSizeChange: (size) => {
                    setLimit(size)
                    setPage(1)
                  },
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
