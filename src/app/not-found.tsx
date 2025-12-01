'use client'
import FuzzyText from '@/components/ui/FuzzyText'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="flex h-[calc(100vh-4rem)] items-center justify-center px-6">
      <section className="max-w-xl w-full text-center">
        {/* Fuzzy 404 Title */}
        <div className="mb-2 flex justify-center">
          <FuzzyText
            fontSize={64}
            fontWeight={800}
            color={getComputedStyleColor('--color-foreground')}
          >
            404
          </FuzzyText>
        </div>
        <div className="mb-2 flex justify-center">
          <FuzzyText
            fontSize={34}
            fontWeight={800}
            color={getComputedStyleColor('--color-foreground')}
          >
            Page not found
          </FuzzyText>
        </div>

        <div className="mt-6 flex items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:opacity-90 transition"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go back home
          </Link>
        </div>
      </section>
    </main>
  )
}

// Helper: read a CSS variable to use with FuzzyText color prop
function getComputedStyleColor(varName: string) {
  if (typeof window === 'undefined') return '#fff'
  const root = document.documentElement
  const value = getComputedStyle(root).getPropertyValue(varName)
  return value?.trim() || '#fff'
}
