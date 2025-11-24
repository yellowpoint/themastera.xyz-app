'use client'

import { useWorks } from '@/hooks/useWorks'
import { Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import { DataTableWithPagination } from '@/components/ui/data-table'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useCreatorColumns } from './columns'

export default function CreatorPage() {
  const router = useRouter()
  const {
    works,
    loading: worksLoading,
    deleteWork,
    fetchWorks,
  } = useWorks({ autoFetch: false })
  const [search, setSearch] = useState<string>('')
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

  useEffect(() => {
    const onDeleted = () => {
      loadWorks()
    }
    window.addEventListener('work-deleted', onDeleted as EventListener)
    return () =>
      window.removeEventListener('work-deleted', onDeleted as EventListener)
  }, [loadWorks])

  const prevFiltersRef = useRef({ statusFilter, debouncedSearch })

  useEffect(() => {
    const filtersChanged =
      prevFiltersRef.current.statusFilter !== statusFilter ||
      prevFiltersRef.current.debouncedSearch !== debouncedSearch
    if (filtersChanged && page !== 1) {
      setPage(1)
      prevFiltersRef.current = { statusFilter, debouncedSearch }
      return
    }
    loadWorks()
    prevFiltersRef.current = { statusFilter, debouncedSearch }
  }, [page, limit, statusFilter, debouncedSearch, loadWorks])

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
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onDebouncedValueChange={(value) => {
                    setDebouncedSearch(value)
                  }}
                  className="pl-9 border-gray-300"
                  disabled={worksLoading}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger
                  className="w-40 border-gray-300"
                  disabled={worksLoading}
                >
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Button
                className="ml-auto"
                onClick={() => router.push('/creator/upload')}
              >
                Upload video
              </Button>
            </div>

            {works.length === 0 && !worksLoading ? (
              <Empty className="border-gray-200">
                <EmptyHeader>
                  <EmptyTitle>
                    {debouncedSearch || statusFilter !== 'all'
                      ? 'No results found'
                      : 'No works yet'}
                  </EmptyTitle>
                  <EmptyDescription>
                    {debouncedSearch || statusFilter !== 'all'
                      ? 'Try adjusting filters or changing your search.'
                      : 'Upload your first video to get started.'}
                  </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  {debouncedSearch || statusFilter !== 'all' ? (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearch('')
                        setDebouncedSearch('')
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
