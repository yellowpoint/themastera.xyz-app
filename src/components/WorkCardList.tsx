'use client'
import { Button } from '@/components/ui/button'
import WorkCard from '@/components/WorkCard'
import WorkCardSkeleton from '@/components/WorkCardSkeleton'
import type { Work } from '@/contracts/domain/work'
import { Inbox } from 'lucide-react'

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
    <div className="space-y-6 py-6">
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
          {isLoadingMore &&
            Array.from({ length: 3 }).map((_, i) => (
              <WorkCardSkeleton key={`loading-${i}`} />
            ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 border border-dashed rounded-lg text-center">
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

      {/* Only show when hasMore is explicitly false (i.e., pagination is supported but exhausted) */}
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
