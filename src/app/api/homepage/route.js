import { NextResponse } from 'next/server'
import { HOMEPAGE_SECTIONS } from '@/config/sections'
import { prisma } from '@/lib/prisma'

// Mock helpers
const rnd = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
const formatDuration = (secs) => {
  const m = Math.floor(secs / 60)
  const s = Math.floor(secs % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

function makeWork(sectionId, idx) {
  const durationSeconds = rnd(60, 360)
  return {
    id: `${sectionId}-${idx}-${rnd(1000, 9999)}`,
    title: `Sample Content ${idx + 1} · ${sectionId.replace(/-/g, ' ')}`,
    thumbnailUrl: `https://picsum.photos/seed/${encodeURIComponent(sectionId)}-${idx}/800/450`,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    user: {
      name: `Artist ${idx + 1}`,
      image: `https://i.pravatar.cc/100?img=${(idx % 70) + 1}`,
    },
    views: rnd(1200, 200000),
    downloads: rnd(100, 5000),
    duration: formatDuration(durationSeconds),
    durationSeconds,
    tags: ['pop', 'featured', 'new'].join(', '),
  }
}

// Map a Work record to homepage item shape, filling missing UI fields
function toHomepageItem(work) {
  const durationSeconds = work.durationSeconds ?? rnd(60, 360)
  return {
    id: work.id,
    title: work.title,
    thumbnailUrl: work.thumbnailUrl || `https://picsum.photos/seed/${encodeURIComponent(work.id)}/800/450`,
    videoUrl: work.fileUrl || null,
    user: {
      name: work.user?.name || 'Unknown',
      image: work.user?.image || `https://i.pravatar.cc/100?u=${encodeURIComponent(work.user?.id || 'unknown')}`,
    },
    views: work.downloads || 0,
    downloads: work.downloads || 0,
    duration: formatDuration(durationSeconds),
    durationSeconds,
    tags: work.tags || '',
  }
}

export async function GET(request) {
  try {
    // Helper: get works for a section with specific query
    async function fetchSectionItems(sectionId) {
      const baseWhere = { status: 'published', isActive: true }

      // Build per-section query
      let where = { ...baseWhere }
      let orderBy = [{ createdAt: 'desc' }]

      const now = new Date()
      const sevenDaysAgo = new Date(now)
      sevenDaysAgo.setDate(now.getDate() - 7)
      const thirtyDaysAgo = new Date(now)
      thirtyDaysAgo.setDate(now.getDate() - 30)

      switch (sectionId) {
        case 'trending':
          orderBy = [{ downloads: 'desc' }, { rating: 'desc' }, { createdAt: 'desc' }]
          break
        case 'featured-artists':
          // Approximate: top rated and downloaded works
          orderBy = [{ rating: 'desc' }, { downloads: 'desc' }, { createdAt: 'desc' }]
          break
        case 'new-releases':
          orderBy = [{ createdAt: 'desc' }]
          break
        case 'popular-this-week':
          where = { ...where, createdAt: { gte: sevenDaysAgo } }
          orderBy = [{ downloads: 'desc' }, { rating: 'desc' }]
          break
        case 'recommended':
          // Without personalization, use highly rated as recommendation
          orderBy = [{ rating: 'desc' }, { downloads: 'desc' }, { createdAt: 'desc' }]
          break
        case 'top-rated':
          orderBy = [{ rating: 'desc' }, { downloads: 'desc' }]
          break
        case 'rising-creators':
          // Recent works with good downloads
          where = { ...where, createdAt: { gte: thirtyDaysAgo } }
          orderBy = [{ downloads: 'desc' }, { createdAt: 'desc' }]
          break
        case 'recently-viewed':
          // No view tracking available; show latest
          orderBy = [{ createdAt: 'desc' }]
          break
        default:
          orderBy = [{ createdAt: 'desc' }]
      }

      const works = await prisma.work.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
        orderBy,
        take: 3,
      })

      // Transform to homepage items
      let items = works.map(toHomepageItem)

      // Fallback to mock if not enough real data
      if (items.length < 3) {
        const needed = 3 - items.length
        const mocks = Array.from({ length: needed }, (_, i) => makeWork(sectionId, i))
        items = items.concat(mocks)
      }

      return items
    }

    // Build sections with up to 3 items each
    const sections = []
    for (const s of HOMEPAGE_SECTIONS) {
      const items = await fetchSectionItems(s.id)
      sections.push({ id: s.id, title: s.title, showAllLink: s.showAllLink, items })
    }

    // Quick picks: take first 8 mixed items from sections
    const quickPicks = sections
      .flatMap((sec) => sec.items.map((w) => ({ ...w })))
      .slice(0, 8)

    return NextResponse.json({
      success: true,
      data: {
        quickPicks,
        sections,
      },
    })
  } catch (error) {
    console.error('Error generating homepage data:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate homepage data', message: error.message },
      { status: 500 }
    )
  }
}