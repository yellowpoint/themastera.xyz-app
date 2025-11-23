'use client'

import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import HeroImageCarousel from '@/components/HeroImageCarousel'
import PlaylistCard from '@/components/PlaylistCard'
import { formatTimeAgo } from '@/lib/format'
import type { HomepageItem } from '@/contracts/domain/work'
import { request } from '@/lib/request'

export default function RecommendTab() {
  const [recLoading, setRecLoading] = React.useState(true)
  const [recError, setRecError] = React.useState<string | null>(null)
  const [recommendItems, setRecommendItems] = React.useState<
    {
      id: string
      name: string
      description?: string
      coverUrl?: string
      list: HomepageItem[]
    }[]
  >([])

  const heroItems = React.useMemo(() => {
    return recommendItems.slice(0, 4)
  }, [recommendItems])

  const fetchRecommend = React.useCallback(async () => {
    setRecLoading(true)
    setRecError(null)
    try {
      const { data } = await request.get('/api/recommend')
      const items = (
        (data as any)?.success ? (data as any)?.data || [] : []
      ) as Array<{
        id: string
        name: string
        description?: string
        coverUrl?: string
        list: HomepageItem[]
      }>
      setRecommendItems(items)
    } catch (e: any) {
      setRecError(e?.message || 'Failed to load')
    } finally {
      setRecLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchRecommend()
  }, [fetchRecommend])

  const filteredRecommendSections = React.useMemo(() => {
    return recommendItems.slice(4)
  }, [recommendItems])

  return (
    <div className="p-0">
      {recLoading ? (
        <div className="p-4 space-y-6">
          <Skeleton className="w-full aspect-video rounded-3xl" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="space-y-3">
                <Skeleton className="h-40 w-full rounded-lg" />
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            ))}
          </div>
        </div>
      ) : recError ? (
        <div className="p-6 text-sm text-muted-foreground">{recError}</div>
      ) : (
        <>
          {heroItems.length > 0 && (
            <HeroImageCarousel items={heroItems} className="mb-8" />
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredRecommendSections.map((sec) => {
              const thumbs = sec.list
                .map((i) => i.thumbnailUrl || null)
                .filter(Boolean) as string[]
              const first = thumbs[0]
              const coverSrcs = [
                first || undefined,
                thumbs[1] || first || undefined,
                thumbs[2] || first || undefined,
              ]
              return (
                <PlaylistCard
                  key={sec.id}
                  title={sec.name}
                  href={`/section?section=${sec.id}`}
                  coverSrcs={coverSrcs}
                  updatedLabel={`Updated: ${formatTimeAgo(
                    (sec.list[0] as any).updatedAt
                  )}`}
                />
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
