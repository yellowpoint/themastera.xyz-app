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

  const fetchData = React.useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await request.get<{ items: Work[]; pagination?: any }>(
        `/api/search${q ? `?q=${encodeURIComponent(q)}` : ''}`
      )
      const list = (data?.data as any)?.items || []
      setItems(list as Work[])
    } catch (_) {
      // handled by request
    } finally {
      setLoading(false)
    }
  }, [q])

  React.useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <div className="px-4 py-6">
      <div className="flex items-center gap-2 mb-4">
        <Search className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
        <h1 className="text-xl font-semibold">Search results{q ? ` for "${q}"` : ''}</h1>
      </div>
      <WorkCardList works={items} isLoading={loading} />
    </div>
  )
}