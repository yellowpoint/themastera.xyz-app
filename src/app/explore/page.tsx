'use client'
import { LANGUAGE_CATEGORIES, MUSIC_CATEGORIES } from '@/config/categories'
import { Filter } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function ExplorePage() {
  const [activeTab, setActiveTab] = useState<'music' | 'language'>('music')
  const cols = 3

  const VARIANTS = [
    'from-[#6D28D9] to-[#DB2777]',
    'from-[#06B6D4] to-[#3B82F6]',
    'from-[#F59E0B] to-[#EF4444]',
    'from-[#22C55E] to-[#84CC16]',
    'from-[#8B5CF6] to-[#3B82F6]',
    'from-[#2563EB] to-[#7C3AED]',
  ]

  const computeVariantIndex = (index: number) => {
    const row = Math.floor(index / cols)
    const col = index % cols
    return (row + col) % VARIANTS.length
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-center mb-4">
        <div className="w-auto">
          <div className="fixed top-6 z-9999 left-1/2 -translate-x-1/2  mx-auto w-fit flex h-10 flex-row items-center space-x-[1px] rounded-2xl border border-white/12 bg-[rgba(10,10,10,0.70)] p-1 shadow-[0_8px_24px_0_rgba(0,0,0,0.25)] backdrop-blur-[6px]">
            <button
              className={`flex h-full items-center justify-center whitespace-nowrap rounded-xl px-3 text-sm font-medium ${activeTab === 'music' ? 'text-white bg-[rgba(255,255,255,0.08)]' : 'text-white/90 hover:text-white hover:bg-[rgba(255,255,255,0.06)]'}`}
              onClick={() => setActiveTab('music')}
            >
              Videos
            </button>
            <button
              className={`flex h-full items-center justify-center whitespace-nowrap rounded-xl px-3 text-sm font-medium ${activeTab === 'language' ? 'text-white bg-[rgba(255,255,255,0.08)]' : 'text-white/90 hover:text-white hover:bg-[rgba(255,255,255,0.06)]'}`}
              onClick={() => setActiveTab('language')}
            >
              Language
            </button>
            <div className="flex w-[1px] items-center justify-center">
              <div className="bg-[rgba(255,255,255,0.12)] h-5 w-full" />
            </div>
            <button
              className="flex h-10 w-10 items-center justify-center rounded-xl disabled:cursor-not-allowed disabled:opacity-30 hover:bg-[rgba(255,255,255,0.06)]"
              title="Filters"
              aria-expanded="false"
            >
              <div className="text-white/90 relative">
                <Filter className="h-[14px] w-[14px]" />
              </div>
            </button>
          </div>
          <div className="fixed top-[56px] left-1/2 -translate-x-1/2 w-[min(680px,90vw)]">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-xl bg-[rgba(255,255,255,0.08)] px-3 py-1 text-xs font-medium text-white/90">
                Recent added
              </span>
              <span className="inline-flex items-center rounded-xl bg-[rgba(255,255,255,0.08)] px-3 py-1 text-xs font-medium text-white/90">
                A–Z
              </span>
              <div className="flex-1"></div>
              <input
                className="text-white placeholder:text-white/70 w-[220px] bg-[rgba(255,255,255,0.06)] px-3 py-2 text-sm font-medium outline-none rounded-xl"
                placeholder="Search category name"
                type="text"
              />
            </div>
          </div>
          {activeTab === 'music' ? (
            <section>
              <div className="grid grid-cols-3 gap-3 mt-24">
                {MUSIC_CATEGORIES.map((cat, idx) => {
                  return (
                    <Link
                      key={cat}
                      href={`/section?category=${encodeURIComponent(cat)}`}
                      prefetch
                    >
                      <div
                        className={`h-[180px] sm:h-[200px] md:h-[220px] w-full rounded-xl overflow-hidden ring-1 ring-white/10 shadow-[0_8px_24px_rgba(0,0,0,0.25)] bg-gradient-to-br ${VARIANTS[computeVariantIndex(idx)]}`}
                      >
                        <div className="p-4 sm:p-5">
                          <div className="text-white text-2xl font-semibold leading-tight">
                            {cat}
                          </div>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </section>
          ) : null}
          {activeTab === 'language' ? (
            <section>
              <div className="grid grid-cols-3 gap-3 mt-24">
                {LANGUAGE_CATEGORIES.map((lang, idx) => {
                  return (
                    <Link
                      key={lang}
                      href={`/section?language=${encodeURIComponent(lang)}`}
                      prefetch
                    >
                      <div
                        className={`h-[180px] sm:h-[200px] md:h-[220px] w-full rounded-xl overflow-hidden ring-1 ring-white/10 shadow-[0_8px_24px_rgba(0,0,0,0.25)] bg-gradient-to-br ${VARIANTS[computeVariantIndex(idx)]}`}
                      >
                        <div className="p-4 sm:p-5">
                          <div className="text-white text-2xl font-semibold leading-tight">
                            {lang}
                          </div>
                        </div>
                      </div>
                    </Link>
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
