'use client'
import SortSearchToolbar from '@/components/SortSearchToolbar'
import { LANGUAGE_CATEGORIES, MUSIC_CATEGORIES } from '@/config/categories'
import { AnimatePresence, motion } from 'framer-motion'
// Remove local Search usage; handled by SortSearchToolbar
import Link from 'next/link'
import { useMemo, useState } from 'react'

import TopTabs from '@/components/TopTabs'

export default function ExplorePage() {
  const [activeTab, setActiveTab] = useState<'music' | 'language'>('music')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortAZ, setSortAZ] = useState(false)
  const cols = 3

  const tabList = [
    { key: 'music', label: 'Videos' },
    { key: 'language', label: 'Language' },
  ]

  const VARIANTS = [
    'from-[#783795] to-[#783795]',
    'from-[#1B556C] to-[#35A5D2]',
    'from-[#F50087] to-[#8F004F]',
    'from-[#954437] to-[#2F1511]',
    'from-[#2E6C1B] to-[#59D235]',
    'from-[#4100F5] to-[#26008F]',
  ]

  const computeVariantIndex = (index: number) => {
    return index % VARIANTS.length
  }

  const filteredCategories = useMemo(() => {
    const categories =
      activeTab === 'music' ? MUSIC_CATEGORIES : LANGUAGE_CATEGORIES
    let res = categories
    const q = searchQuery.trim().toLowerCase()
    if (q) {
      res = res.filter((c) => c.toLowerCase().includes(q))
    }
    if (sortAZ) {
      res = [...res].sort((a, b) => a.localeCompare(b))
    }
    return res
  }, [activeTab, searchQuery, sortAZ])

  const [hoveredCat, setHoveredCat] = useState<string | null>(null)

  return (
    <div className="container max-w-5xl mx-auto px-4 py-6">
      <div className="flex justify-center mb-4">
        <div className="w-full">
          <TopTabs
            tabs={tabList}
            activeKey={activeTab}
            onChange={(key) => setActiveTab(key as 'music' | 'language')}
          />
          <div className="">
            <h1 className="text-4xl text-white mb-10">
              {activeTab === 'music' ? 'Videos' : 'Language'}
            </h1>
            <SortSearchToolbar
              sortAZ={sortAZ}
              onSortChange={setSortAZ}
              searchQuery={searchQuery}
              onSearchQueryChange={setSearchQuery}
              searchPlaceholder="Search category name"
            />
            <section>
              <div
                className="grid grid-cols-3 gap-6"
                onMouseLeave={() => setHoveredCat(null)}
              >
                {filteredCategories.map((cat, idx) => {
                  const queryParam =
                    activeTab === 'music' ? 'category' : 'language'
                  return (
                    <Link
                      key={cat}
                      href={`/section?${queryParam}=${encodeURIComponent(cat)}`}
                      prefetch
                      className="relative group block"
                      onMouseEnter={() => setHoveredCat(cat)}
                    >
                      <AnimatePresence>
                        {hoveredCat === cat && (
                          <motion.span
                            className="absolute inset-0 -m-2 bg-overlay rounded-2xl z-[-1]"
                            layoutId="hoverBackground"
                            initial={{ opacity: 0 }}
                            animate={{
                              opacity: 1,
                              transition: { duration: 0.15 },
                            }}
                            exit={{
                              opacity: 0,
                              transition: { duration: 0.15, delay: 0.2 },
                            }}
                          />
                        )}
                      </AnimatePresence>
                      <div
                        className={`h-[180px] w-full rounded-xl overflow-hidden ring-1 ring-white/10 shadow-[0_8px_24px_rgba(0,0,0,0.25)] bg-gradient-to-br ${VARIANTS[computeVariantIndex(idx)]}`}
                      >
                        <div className="p-6">
                          <div className="text-white text-4xl font-bold">
                            {cat.split('/').map((part, index) => (
                              <div key={index}>{part.trim()}</div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
