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
    <div className="flex md:h-[calc(100vh-140px)] min-h-[60vh] items-center justify-center  md:px-6">
      <div>
        <div className="flex flex-col items-center justify-center gap-3 md:gap-4">
          <FuzzyText fontSize={'clamp(1.75rem, 8vw, 3rem)'} fontWeight={800}>
            Coming soon
          </FuzzyText>
          {/* <FuzzyText
            fontSize={'clamp(0.6rem, 4.5vw, 1.25rem)'}
            fontWeight={400}
          >
            {description}
          </FuzzyText> */}
        </div>
      </div>
    </div>
  )
}
