'use client'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

type BackButtonProps = {
  label?: string
  className?: string
}

export default function BackButton({
  label = 'Back',
  className,
}: BackButtonProps) {
  const router = useRouter()
  return (
    <div
      className={`h-20 sticky top-0 z-20 flex items-center ${className ?? ''}`}
    >
      <Button variant="ghost" onClick={() => router.back()}>
        <span className="inline-flex items-center gap-2">
          <ChevronLeft className="size-4" />
          {label}
        </span>
      </Button>
    </div>
  )
}
