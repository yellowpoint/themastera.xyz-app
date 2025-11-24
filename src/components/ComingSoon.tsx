'use client'

import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { Clock } from 'lucide-react'
import Link from 'next/link'

type Props = {
  title?: string
  description?: string
  backUrl?: string
  backLabel?: string
}

export default function ComingSoon({
  title = 'Coming soon',
  description = "We're building this page. Check back later.",
  backUrl = '/',
  backLabel = 'Go back home',
}: Props) {
  return (
    <div className="flex h-[calc(100vh-140px)] items-center justify-center px-6">
      <Empty className="border-gray-200">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Clock className="size-6" />
          </EmptyMedia>
          <EmptyTitle>{title}</EmptyTitle>
          <EmptyDescription>{description}</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Link href={backUrl} className="inline-block">
            <Button variant="default" size="sm">
              {backLabel}
            </Button>
          </Link>
        </EmptyContent>
      </Empty>
    </div>
  )
}
