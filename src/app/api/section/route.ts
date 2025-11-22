import { apiFailure, apiSuccess } from '@/contracts/types/common'
import { formatDuration } from '@/lib/format'
import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

// Helpers
const rnd = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min

function toHomepageItem(work: any) {
  const durationSeconds = rnd(60, 360)
  return {
    id: work.id,
    title: work.title,
    thumbnailUrl:
      work.thumbnailUrl ||
      `https://picsum.photos/seed/${encodeURIComponent(work.id)}/800/450`,
    videoUrl: work.fileUrl || null,
    user: {
      name: work.user?.name || 'Unknown',
      image:
        work.user?.image ||
        `https://i.pravatar.cc/100?u=${encodeURIComponent(work.user?.id || 'unknown')}`,
    },
    views: work.views || 0,
    downloads: work.downloads || 0,
    duration: formatDuration(durationSeconds),
    durationSeconds,
    tags: work.tags || '',
    language: work.language || null,
    fileUrl: work.fileUrl || null,
    createdAt: work.createdAt,
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sectionId = searchParams.get('section') || undefined
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '24')
    const skip = (page - 1) * limit
    const category = searchParams.get('category') || undefined
    const language = searchParams.get('language') || undefined

    const baseWhere: Prisma.WorkWhereInput = {
      status: 'published',
    }
    let where: Prisma.WorkWhereInput = { ...baseWhere }
    let orderBy: Prisma.WorkOrderByWithRelationInput[] = [{ createdAt: 'desc' }]

    const now = new Date()
    const sevenDaysAgo = new Date(now)
    sevenDaysAgo.setDate(now.getDate() - 7)
    const thirtyDaysAgo = new Date(now)
    thirtyDaysAgo.setDate(now.getDate() - 30)

    switch (sectionId) {
      case 'trending':
        orderBy = [{ views: 'desc' }]
        break
      case 'featured-artists':
        orderBy = [{ views: 'desc' }, { createdAt: 'desc' }]
        break
      case 'new-releases':
        orderBy = [{ createdAt: 'desc' }]
        break
      case 'popular-this-week':
        where = { ...where, createdAt: { gte: sevenDaysAgo } }
        orderBy = [{ views: 'desc' }]
        break
      case 'recommended':
        orderBy = [{ views: 'desc' }, { createdAt: 'desc' }]
        break
      case 'top-rated':
        orderBy = [{ views: 'desc' }]
        break
      case 'rising-creators':
        where = { ...where, createdAt: { gte: thirtyDaysAgo } }
        orderBy = [{ views: 'desc' }, { createdAt: 'desc' }]
        break
      case 'recently-viewed':
        orderBy = [{ createdAt: 'desc' }]
        break
      default:
        orderBy = [{ createdAt: 'desc' }]
    }

    // Apply optional filters
    if (category) {
      where = { ...where, category }
    }
    if (language) {
      where = { ...where, language }
    }

    const works = await prisma.work.findMany({
      where,
      include: {
        user: {
          select: { id: true, name: true, image: true },
        },
      },
      orderBy,
      skip,
      take: limit,
    })

    const total = await prisma.work.count({ where })
    const items = works.map(toHomepageItem)

    const payload = {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }

    return NextResponse.json(apiSuccess(payload))
  } catch (error) {
    console.error('Error fetching section items:', error)
    return NextResponse.json(
      apiFailure('INTERNAL_ERROR', 'Failed to fetch section items', {
        message: (error as any)?.message,
      }),
      { status: 500 }
    )
  }
}
