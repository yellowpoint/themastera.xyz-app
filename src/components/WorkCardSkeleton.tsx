"use client"
import React from "react"
import { Skeleton } from "@/components/ui/skeleton"

export default function WorkCardSkeleton() {
  return (
    <div>
      <Skeleton className="aspect-video w-full rounded-xl" />
      <div className="flex items-center gap-3 mt-3">
        <Skeleton className="size-10 rounded-md" />
        <div className="flex-1 min-w-0 space-y-2">
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-4 w-1/3" />
        </div>
        <Skeleton className="h-8 w-8" />
      </div>
    </div>
  )
}

export function WorkCardSkeletonLite() {
  return (
    <div>
      <Skeleton className="aspect-video w-full rounded-xl" />
      <div className="flex items-center gap-3 mt-3">
        <Skeleton className="size-10 rounded-md" />
        <div className="flex-1 min-w-0 space-y-2">
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-4 w-1/3" />
        </div>
      </div>
    </div>
  )
}