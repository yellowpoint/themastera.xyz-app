'use client'
import WorkCardList from '@/components/WorkCardList'
import { HOMEPAGE_SECTIONS } from '@/config/sections'
import type { Work } from '@/contracts/domain/work'
import { request } from '@/lib/request'
import { useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

export default function SectionUnifiedPage() {
  const searchParams = useSearchParams()
  const section = searchParams.get('section') || undefined
  const initialPage = parseInt(searchParams.get('page') || '1')
  const filterCategory = searchParams.get('category') || undefined
  const filterLanguage = searchParams.get('language') || undefined

  const [page, setPage] = useState<number>(initialPage)
  const [limit] = useState<number>(10)
  const [items, setItems] = useState<Work[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [loadingMore, setLoadingMore] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [totalPages, setTotalPages] = useState<number>(1)

  // Build a unified header title based on whichever filter is active
  const headerTitle = useMemo(() => {
    if (section) {
      const meta = HOMEPAGE_SECTIONS.find((s) => s.id === section)
      return meta?.title || section
    }
    if (filterCategory) return `Category: ${filterCategory}`
    if (filterLanguage) return `Language: ${filterLanguage}`
    return 'All Items'
  }, [section, filterCategory, filterLanguage])

  useEffect(() => {
    async function fetchPage() {
      if (page === 1) {
        setLoading(true)
      } else {
        setLoadingMore(true)
      }
      setError(null)
      try {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(limit),
        })
        if (filterCategory) params.set('category', filterCategory)
        if (filterLanguage) params.set('language', filterLanguage)
        if (section) params.set('section', section)
        const { data } = await request.get<Work>(
          `/api/section?${params.toString()}`
        )
        if (data?.success) {
          const payload = (data.data as any)?.items as any[]
          setItems((prev) =>
            page === 1 ? payload || [] : [...prev, ...(payload || [])]
          )
          setTotalPages((data.data as any)?.pagination?.totalPages || 1)
        } else {
          setError((data as any)?.error || 'Failed to load items')
        }
      } catch (e) {
        setError('Network error, please try again')
      } finally {
        if (page === 1) {
          setLoading(false)
        } else {
          setLoadingMore(false)
        }
      }
    }
    // Treat section, category, and language as equivalent filters
    if (section || filterCategory || filterLanguage) fetchPage()
  }, [section, page, limit, filterCategory, filterLanguage])

  const canLoadMore = page < totalPages

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">{headerTitle}</h1>
          <p className="text-sm text-muted-foreground">
            Browse all items in this section.
          </p>
        </div>
      </div>

      <WorkCardList
        works={items}
        isLoading={loading}
        isLoadingMore={loadingMore}
        hasMore={canLoadMore}
        onLoadMore={() => setPage((p) => p + 1)}
      />
    </div>
  )
}
