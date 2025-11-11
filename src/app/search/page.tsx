'use client'
import React from 'react'
import { useSearchParams } from 'next/navigation'
import { request } from '@/lib/request'
import WorkCardList from '@/components/WorkCardList'
import type { Work } from '@/contracts/domain/work'
import { Search } from 'lucide-react'

export default function SearchPage() {
  const params = useSearchParams()
  const q = params.get('q') || ''
  const [items, setItems] = React.useState<Work[]>([])
  const [loading, setLoading] = React.useState<boolean>(false)
  const [loadingMore, setLoadingMore] = React.useState<boolean>(false)
  const [page, setPage] = React.useState<number>(1)
  const [limit] = React.useState<number>(10)
  const [totalPages, setTotalPages] = React.useState<number>(1)

  React.useEffect(() => {
    // Reset when query changes
    setPage(1)
    setItems([])
  }, [q])

  React.useEffect(() => {
    async function fetchData() {
      if (page === 1) {
        setLoading(true)
      } else {
        setLoadingMore(true)
      }
      try {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(limit),
        })
        if (q) params.set('q', q)
        const { data } = await request.get<{ items: Work[]; pagination?: any }>(
          `/api/search?${params.toString()}`
        )
        const payload = (data?.data as any)?.items || []
        const pagination = (data?.data as any)?.pagination
        setItems((prev) => (page === 1 ? (payload as Work[]) : [...prev, ...(payload as Work[])]))
        if (pagination?.totalPages) {
          setTotalPages(pagination.totalPages)
        } else {
          // Fallback: if no pagination provided, assume single page
          setTotalPages(1)
        }
      } catch (_) {
        // Errors are handled in request helper; keep UI simple
      } finally {
        if (page === 1) {
          setLoading(false)
        } else {
          setLoadingMore(false)
        }
      }
    }
    fetchData()
  }, [q, page, limit])

  return (
    <div className="px-4 py-6">
      <div className="flex items-center gap-2 mb-4">
        <Search className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
        <h1 className="text-xl font-semibold">Search results{q ? ` for "${q}"` : ''}</h1>
      </div>
      <WorkCardList
        works={items}
        isLoading={loading}
        isLoadingMore={loadingMore}
        hasMore={page < totalPages}
        onLoadMore={() => setPage((p) => p + 1)}
      />
    </div>
  )
}