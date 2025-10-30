"use client";
import React from "react";
import WorkCard from "@/components/WorkCard";
import WorkCardSkeleton from "@/components/WorkCardSkeleton";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

/**
 * WorkCardList — unified list renderer for works
 * Props:
 * - items: array of work items (required)
 * - loading: boolean (optional)
 * - error: string (optional)
 * - skeletonCount: number (optional, default 12)
 * - columnsClass: string (optional, default grid cols 1/2/3)
 * - canLoadMore: boolean (optional)
 * - onLoadMore: function (optional)
 * - loadMoreLabel: string (optional, default "Load More")
 * - emptyMessage: string (optional, default "No items found")
 */
export default function WorkCardList({
  items = [],
  loading = false,
  error = "",
  skeletonCount = 12,
  columnsClass = "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4",
  canLoadMore = false,
  onLoadMore,
  loadMoreLabel = "Load More",
  emptyMessage = "No items found",
}) {
  const showEmpty = !loading && !error && Array.isArray(items) && items.length === 0;

  return (
    <div>
      {/* Grid area */}
      {loading ? (
        <div className={columnsClass}>
          {Array.from({ length: skeletonCount }).map((_, i) => (
            <WorkCardSkeleton key={`s-${i}`} />
          ))}
        </div>
      ) : error ? (
        <div className="flex items-center gap-2 text-sm text-red-600">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      ) : showEmpty ? (
        <div className="text-sm text-muted-foreground">{emptyMessage}</div>
      ) : (
        <div className={columnsClass}>
          {items.map((w) => (
            <WorkCard key={w.id} work={w} />
          ))}
        </div>
      )}

      {/* Load more */}
      {onLoadMore && canLoadMore && !loading && !error && (
        <div className="flex justify-center mt-6">
          <Button variant="outline" onClick={onLoadMore}>{loadMoreLabel}</Button>
        </div>
      )}
    </div>
  );
}