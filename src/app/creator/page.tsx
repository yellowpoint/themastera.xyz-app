'use client'

import { useState, useEffect } from 'react'
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
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const columns = useCreatorColumns()

  // Filter works based on search and visibility
  const filteredWorks: Work[] = works.filter((work: Work) => {
    const matchesSearch = work?.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || work.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // formatters moved to shared module

  useEffect(() => {
    const onDeleted = () => {
      fetchWorks()
    }
    window.addEventListener('work-deleted', onDeleted as EventListener)
    return () =>
      window.removeEventListener('work-deleted', onDeleted as EventListener)
  }, [fetchWorks])

  return (
    <div className="h-full">
      <div className="">
        <div className="max-w-7xl mx-auto px-8 py-6">
          {/* Page Title */}
          <div className="mb-10">
            {authLoading || worksLoading ? (
              <Skeleton className="h-7 w-48" />
            ) : (
              <h1 className="text-2xl font-normal">Dashboard</h1>
            )}
          </div>

          <div className="space-y-6">
            {/* Search and Filter */}
            <div className="flex gap-4">
              {authLoading || worksLoading ? (
                <>
                  <Skeleton className="h-9 w-64" />
                  <Skeleton className="h-9 w-40" />
                </>
              ) : (
                <>
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search for video name"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 border-gray-300"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40 border-gray-300">
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All statuses</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </>
              )}
            </div>

            {authLoading || worksLoading ? (
              <div className="border rounded-sm p-4 w-full">
                {/* Table header skeleton */}
                <div className="grid grid-cols-5 gap-3 mb-3">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                </div>
                {/* Rows skeleton */}
                <div className="space-y-2">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="grid grid-cols-1 gap-3">
                      <Skeleton className="h-5 w-full" />
                      <Skeleton className="h-5 w-full" />
                      <Skeleton className="h-5 w-full" />
                      <Skeleton className="h-5 w-full" />
                      <Skeleton className="h-5 w-full" />
                    </div>
                  ))}
                </div>
              </div>
            ) : filteredWorks.length === 0 ? (
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
              <DataTableWithPagination columns={columns} data={filteredWorks} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
