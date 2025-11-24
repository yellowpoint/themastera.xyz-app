'use client'

import FuzzyText from '@/components/FuzzyText'

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
      <div>
        <div className="gap-4 flex flex-col items-center justify-center">
          <FuzzyText fontSize={64} fontWeight={800}>
            {title}
          </FuzzyText>
          <FuzzyText fontSize={34} fontWeight={400}>
            {description}
          </FuzzyText>
        </div>
      </div>
    </div>
  )
}
