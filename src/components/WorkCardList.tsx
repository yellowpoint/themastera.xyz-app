'use client'
import React from 'react'
import WorkCard from '@/components/WorkCard'
import { Work } from '@/hooks/useWorks'
import { Button } from '@/components/ui/button'
import WorkCardSkeleton, {
  WorkCardSkeletonLite,
} from '@/components/WorkCardSkeleton'

type Props = {
  works: Work[]
  isLoading?: boolean
  isLoadingMore?: boolean
  hasMore?: boolean
  onLoadMore?: () => void
}

export default function WorkCardList({
  works,
  isLoading,
  isLoadingMore,
  hasMore,
  onLoadMore,
}: Props) {
  return (
    <div className="space-y-6">
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <WorkCardSkeleton key={i} />
          ))}
        </div>
      ) : works?.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {works.map((work) => (
            <WorkCard key={work.id} work={work} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <WorkCardSkeletonLite key={i} />
          ))}
        </div>
      )}

      {hasMore && (
        <div className="flex justify-center">
          <Button onClick={onLoadMore} disabled={isLoadingMore} type="button">
            {isLoadingMore ? 'Loading...' : 'Load more'}
          </Button>
        </div>
      )}
    </div>
  )
}
