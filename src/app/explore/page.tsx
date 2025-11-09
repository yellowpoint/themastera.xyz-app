'use client'
import React, { useEffect, useMemo, useState } from 'react'
import { Music, Globe } from 'lucide-react'
import WorkCardList from '@/components/WorkCardList'
import { MUSIC_CATEGORIES, LANGUAGE_CATEGORIES } from '@/config/categories'
import { request } from '@/lib/request'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CometCard } from '@/components/ui/comet-card'
import Link from 'next/link'
import type { Paginated } from '@/contracts/types/common'
import type { Work, WorkFilters } from '@/contracts/domain/work'

export default function ExplorePage() {
  return (
    <div className="h-full container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Explore</h1>
        <p className="text-sm text-muted-foreground">
          Discover trending works by category and language.
        </p>
      </div>

      {/* Filters - Card Galleries */}
      <div className="space-y-8 mb-8">
        {/* Music Categories */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Music className="h-4 w-4" />
            <span className="text-sm font-medium">Music Categories</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {MUSIC_CATEGORIES.map((cat) => {
              return (
                <CometCard key={cat} className="group">
                  <Link
                    href={`/section?category=${encodeURIComponent(cat)}`}
                    prefetch
                  >
                    <Card
                      role="link"
                      className={`select-none transition-colors cursor-pointer rounded-xl border`}
                    >
                      <CardHeader className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Music className="h-4 w-4" />
                          <CardTitle className="text-sm">{cat}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="px-4 pb-4">
                        <div className="text-muted-foreground text-xs">
                          Tap to view section
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </CometCard>
              )
            })}
          </div>
        </section>

        {/* Languages */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Globe className="h-4 w-4" />
            <span className="text-sm font-medium">Languages</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4  gap-3">
            {LANGUAGE_CATEGORIES.map((lang) => {
              return (
                <CometCard key={lang} className="group">
                  <Link
                    href={`/section?language=${encodeURIComponent(lang)}`}
                    prefetch
                  >
                    <Card
                      role="link"
                      className={`select-none transition-colors cursor-pointer rounded-xl border`}
                    >
                      <CardHeader className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4" />
                          <CardTitle className="text-sm">{lang}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="px-4 pb-4">
                        <div className="text-muted-foreground text-xs">
                          Tap to view section
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </CometCard>
              )
            })}
          </div>
        </section>
      </div>
    </div>
  )
}
