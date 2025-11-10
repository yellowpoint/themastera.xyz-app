'use client'

import { Spinner } from '@/components/ui/spinner'

// Minimal, centered loading layer for WorkDetailsForm
// Only shows the spinner icon as requested
export function PageLoading() {
  return (
    <div className="h-[calc(100vh-120px)] flex items-center justify-center">
      <Spinner className="h-8 w-8" />
    </div>
  )
}

export default PageLoading
