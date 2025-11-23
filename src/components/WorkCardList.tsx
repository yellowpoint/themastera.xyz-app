'use client'
import { Button } from '@/components/ui/button'
import WorkCard from '@/components/WorkCard'
import WorkCardSkeleton, {
  WorkCardSkeletonLite,
} from '@/components/WorkCardSkeleton'
import type { Work } from '@/contracts/domain/work'
import { Inbox } from 'lucide-react'

type Props = {
  works: Work[]
  isLoading?: boolean
  isLoadingMore?: boolean
  hasMore?: boolean
  onLoadMore?: () => void
  columns?: 1 | 2 | 3 | 4 | 5 | 6
  variant?: 'grid' | 'simple' | 'cover'
  extraMenuItems?: (work: Work) => React.ReactNode
}

export default function WorkCardList({
  works,
  isLoading,
  isLoadingMore,
  hasMore,
  onLoadMore,
  columns = 3,
  variant,
  extraMenuItems,
}: Props) {
  const effectiveVariant: 'grid' | 'simple' | 'cover' = variant
    ? variant
    : columns === 1
      ? 'simple'
      : 'grid'
  const mdColsClass = (
    {
      1: 'md:grid-cols-1',
      2: 'md:grid-cols-2',
      3: 'md:grid-cols-3',
      4: 'md:grid-cols-4',
      5: 'md:grid-cols-5',
      6: 'md:grid-cols-6',
    } as const
  )[columns]
  return (
    <div className="space-y-6">
      {isLoading ? (
        effectiveVariant === 'simple' ? (
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <WorkCardSkeletonLite key={i} />
            ))}
          </div>
        ) : effectiveVariant === 'cover' ? (
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <WorkCardSkeletonLite key={i} />
            ))}
          </div>
        ) : (
          <div className={`grid grid-cols-1 ${mdColsClass} gap-6`}>
            {Array.from({ length: 6 }).map((_, i) => (
              <WorkCardSkeleton key={i} />
            ))}
          </div>
        )
      ) : works?.length ? (
        effectiveVariant === 'simple' ? (
          <div className="space-y-4">
            {works.map((work) => (
              <WorkCard
                key={work.id}
                work={work}
                variant="simple"
                extraMenuItems={extraMenuItems?.(work)}
              />
            ))}
            {isLoadingMore &&
              Array.from({ length: 3 }).map((_, i) => (
                <WorkCardSkeletonLite key={`loading-${i}`} />
              ))}
          </div>
        ) : effectiveVariant === 'cover' ? (
          <div className="space-y-4">
            {works.map((work) => (
              <WorkCard
                key={work.id}
                work={work}
                variant="cover"
                extraMenuItems={extraMenuItems?.(work)}
              />
            ))}
            {isLoadingMore &&
              Array.from({ length: 3 }).map((_, i) => (
                <WorkCardSkeletonLite key={`loading-${i}`} />
              ))}
          </div>
        ) : (
          <div className={`grid grid-cols-1 ${mdColsClass} gap-6`}>
            {works.map((work) => (
              <WorkCard
                key={work.id}
                work={work}
                extraMenuItems={extraMenuItems?.(work)}
              />
            ))}
            {isLoadingMore &&
              Array.from({ length: 3 }).map((_, i) => (
                <WorkCardSkeleton key={`loading-${i}`} />
              ))}
          </div>
        )
      ) : (
        <div className="flex flex-col items-center justify-center py-16 rounded-lg text-center bg-[#F6F9FC1A]">
          <Inbox
            className="h-10 w-10 text-muted-foreground mb-3"
            aria-hidden="true"
          />
          <h2 className="text-lg font-medium">No items found</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Try adjusting filters or check back later.
          </p>
        </div>
      )}

      {hasMore && (
        <div className="flex justify-center">
          <Button onClick={onLoadMore} disabled={isLoadingMore} type="button">
            {isLoadingMore ? 'Loading...' : 'Load more'}
          </Button>
        </div>
      )}

      {!isLoading && !isLoadingMore && hasMore === false && works?.length ? (
        <div className="flex justify-center">
          <p className="text-sm text-muted-foreground" aria-live="polite">
            All items loaded
          </p>
        </div>
      ) : null}
    </div>
  )
}
