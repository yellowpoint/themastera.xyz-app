'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CometCard } from '@/components/ui/comet-card'
import { LANGUAGE_CATEGORIES, MUSIC_CATEGORIES } from '@/config/categories'
import { Globe, Music } from 'lucide-react'
import Link from 'next/link'

export default function ExplorePage() {
  return (
    <div className="container mx-auto px-4 py-6">
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
            {MUSIC_CATEGORIES.map((cat, idx) => {
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
                        {/* Preview image for category (first 10 have images) - square display */}
                        {(() => {
                          const imgSrc =
                            idx < 16
                              ? `/categories/${idx + 1}.jpg`
                              : '/thumbnail-placeholder.svg'
                          return (
                            <div className="aspect-square w-full rounded-md overflow-hidden mb-2">
                              <img
                                src={imgSrc}
                                alt={`${cat}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )
                        })()}
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
            {LANGUAGE_CATEGORIES.map((lang, idx) => {
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
                        {/* Language image - square display */}
                        {(() => {
                          const imgSrc =
                            idx < 11
                              ? `/language/${idx + 1}.jpg`
                              : '/thumbnail-placeholder.svg'
                          return (
                            <div className="aspect-square w-full rounded-md overflow-hidden mb-2">
                              <img
                                src={imgSrc}
                                alt={`${lang}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )
                        })()}
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
