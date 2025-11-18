'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CometCard } from '@/components/ui/comet-card'
import { LANGUAGE_CATEGORIES, MUSIC_CATEGORIES } from '@/config/categories'
import { Filter, Globe, Music, Search } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function ExplorePage() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'music' | 'language'>('music')
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-center mb-4">
        <div className="w-auto">
          <div className="fixed top-6 z-9999 left-1/2 -translate-x-1/2 border-secondary mx-auto w-fit flex h-10 flex-row items-center space-x-[1px] rounded-2xl border bg-[rgba(10,10,10,0.70)] p-1 shadow-[0_8px_24px_0_rgba(0,0,0,0.25)] backdrop-blur-[6px]">
            <button
              className={`flex h-full items-center justify-center whitespace-nowrap rounded-xl px-3 text-sm font-medium ${activeTab === 'music' ? 'text-primary bg-[rgba(255,255,255,0.08)]' : 'text-secondary hover:text-primary hover:bg-[rgba(255,255,255,0.06)]'}`}
              onClick={() => setActiveTab('music')}
            >
              Music
            </button>
            <button
              className={`flex h-full items-center justify-center whitespace-nowrap rounded-xl px-3 text-sm font-medium ${activeTab === 'language' ? 'text-primary bg-[rgba(255,255,255,0.08)]' : 'text-secondary hover:text-primary hover:bg-[rgba(255,255,255,0.06)]'}`}
              onClick={() => setActiveTab('language')}
            >
              Language
            </button>
            <div className="flex w-[1px] items-center justify-center"><div className="bg-[rgba(255,255,255,0.12)] h-5 w-full" /></div>
            <button className="flex h-10 w-10 items-center justify-center rounded-xl disabled:cursor-not-allowed disabled:opacity-30 hover:bg-[rgba(255,255,255,0.06)]" title="Filters" aria-expanded="false">
              <div className="text-secondary relative"><Filter className="h-[14px] w-[14px]" /></div>
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-xl disabled:cursor-not-allowed disabled:opacity-30 hover:bg-[rgba(255,255,255,0.06)]" title="Search" onClick={() => setSearchOpen((v) => !v)} aria-expanded={searchOpen}>
              <div className="text-secondary relative"><Search className="h-4 w-4" /></div>
            </button>
          </div>
          <div className={
            'fixed top-[56px] left-1/2 -translate-x-1/2 max-w-[219px] overflow-hidden transition-[max-height,opacity] duration-300 ease-out ' +
            (searchOpen ? 'max-h-12 opacity-100' : 'max-h-0 opacity-0')
          }>
            <div className="flex h-10 flex-row items-center gap-3 pt-2">
              <input className="text-primary placeholder:text-muted-foreground w-full bg-transparent pl-3 text-base font-medium outline-none sm:text-sm" placeholder="Search" type="text" />
            </div>
          </div>
          {activeTab === 'music' ? (
            <section>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-4">
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
          ) : null}
          {activeTab === 'language' ? (
            <section>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4  gap-3 mt-4">
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
          ) : null}
        </div>
      </div>
    </div>
  )
}
