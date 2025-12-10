'use client'
import SortSearchToolbar from '@/components/SortSearchToolbar'
import WorkCardList from '@/components/WorkCardList'
import { HOMEPAGE_SECTIONS } from '@/config/sections'
import type { Work } from '@/contracts/domain/work'
import { request } from '@/lib/request'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

export default function SectionUnifiedPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const section = searchParams.get('section') || undefined
  const initialPage = parseInt(searchParams.get('page') || '1')
  const filterCategory = searchParams.get('category') || undefined
  const filterLanguage = searchParams.get('language') || undefined

  const [page, setPage] = useState<number>(initialPage)
  const [limit] = useState<number>(20) // Increased limit to have enough items for hero + grid
  const [items, setItems] = useState<Work[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [loadingMore, setLoadingMore] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortAZ, setSortAZ] = useState(false)

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

  const gridItems = items
    .filter((item) => {
      if (!searchQuery) return true
      return item.title.toLowerCase().includes(searchQuery.toLowerCase())
    })
    .sort((a, b) => (sortAZ ? a.title.localeCompare(b.title) : 0))

  // Use skeletons via WorkCardList instead of plain loading text

  if (error && items.length === 0) {
    return <div className=" text-center text-red-500">{error}</div>
  }

  return (
    <div className=" space-y-6">
      <h1 className="text-2xl font-semibold">{headerTitle}</h1>
      <SortSearchToolbar
        sortAZ={sortAZ}
        onSortChange={setSortAZ}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        searchPlaceholder="Search the video name"
      />

      {/* Grid List */}
      <WorkCardList
        works={gridItems}
        isLoading={loading && items.length === 0}
        isLoadingMore={loadingMore}
        hasMore={canLoadMore}
        onLoadMore={() => setPage((p) => p + 1)}
        columns={3}
      />
    </div>
  )
}
