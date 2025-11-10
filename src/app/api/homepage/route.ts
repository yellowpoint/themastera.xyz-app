import { NextResponse, NextRequest } from 'next/server'
import { HOMEPAGE_SECTIONS } from '@/config/sections'
import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'
// No mock data; return raw database records

// Map a Work record to homepage item shape, filling missing UI fields
function toHomepageItem(work: any) {
  return {
    id: work.id,
    title: work.title,
    thumbnailUrl: work.thumbnailUrl ?? null,
    fileUrl: work.fileUrl ?? null,
    user: work.user
      ? { id: work.user.id, name: work.user.name, image: work.user.image }
      : null,
    views: work.views ?? 0,
    downloads: work.downloads ?? 0,
    duration: work.duration ?? null,
    durationSeconds: work.durationSeconds ?? null,
    tags: work.tags ?? '',
    language: work.language ?? null,
  }
}

export async function GET(request: NextRequest) {
  try {
    // Helper: get works for a section with specific query
    async function fetchSectionItems(sectionId: string) {
      const baseWhere: Prisma.WorkWhereInput = { status: 'published' }

      // Build per-section query
      let where: Prisma.WorkWhereInput = { ...baseWhere }
      let orderBy: Prisma.WorkOrderByWithRelationInput[] = [
        { createdAt: 'desc' },
      ]

      const now = new Date()
      const sevenDaysAgo = new Date(now)
      sevenDaysAgo.setDate(now.getDate() - 7)
      const thirtyDaysAgo = new Date(now)
      thirtyDaysAgo.setDate(now.getDate() - 30)

      switch (sectionId) {
        case 'trending':
          orderBy = [
            { downloads: 'desc' },
            { rating: 'desc' },
            { createdAt: 'desc' },
          ]
          break
        case 'featured-artists':
          // Approximate: top rated and downloaded works
          orderBy = [
            { rating: 'desc' },
            { downloads: 'desc' },
            { createdAt: 'desc' },
          ]
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
          orderBy = [
            { rating: 'desc' },
            { downloads: 'desc' },
            { createdAt: 'desc' },
          ]
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
      const items = works.map(toHomepageItem)
      return items
    }

    // Build sections with up to 3 items each
    const sections: Array<{
      id: string
      title: string
      showAllLink?: string
      items: any[]
    }> = []
    for (const s of HOMEPAGE_SECTIONS) {
      const items = await fetchSectionItems(s.id)
      sections.push({
        id: s.id,
        title: s.title,
        showAllLink: s.showAllLink,
        items,
      })
    }

    // Quick picks: strictly use Work.quickPick boolean
    const quickPicksWorks = await prisma.work.findMany({
      where: {
        status: 'published',
        quickPick: true,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: [{ createdAt: 'desc' }],
      take: 8,
    })

    const quickPicks = quickPicksWorks.map(toHomepageItem)

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
      {
        success: false,
        error: 'Failed to generate homepage data',
        message: error.message,
      },
      { status: 500 }
    )
  }
}
