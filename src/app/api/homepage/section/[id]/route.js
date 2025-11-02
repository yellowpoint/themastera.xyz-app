import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { formatDuration } from '@/lib/format'

// Helpers
const rnd = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

function toHomepageItem(work) {
  const durationSeconds = rnd(60, 360)
  return {
    id: work.id,
    title: work.title,
    thumbnailUrl: work.thumbnailUrl || `https://picsum.photos/seed/${encodeURIComponent(work.id)}/800/450`,
    videoUrl: work.fileUrl || null,
    user: {
      name: work.user?.name || 'Unknown',
      image: work.user?.image || `https://i.pravatar.cc/100?u=${encodeURIComponent(work.user?.id || 'unknown')}`,
    },
    views: work.views || 0,
    downloads: work.downloads || 0,
    duration: formatDuration(durationSeconds),
    durationSeconds,
    tags: work.tags || '',
    language: work.language || null,
  }
}

export async function GET(request, { params }) {
  try {
    const { searchParams } = new URL(request.url)
    const { id: sectionId } = await params
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '24')
    const skip = (page - 1) * limit

    const baseWhere = { status: 'published', isActive: true }
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
        orderBy = [{ rating: 'desc' }, { downloads: 'desc' }, { createdAt: 'desc' }]
        break
      case 'top-rated':
        orderBy = [{ rating: 'desc' }, { downloads: 'desc' }]
        break
      case 'rising-creators':
        where = { ...where, createdAt: { gte: thirtyDaysAgo } }
        orderBy = [{ downloads: 'desc' }, { createdAt: 'desc' }]
        break
      case 'recently-viewed':
        orderBy = [{ createdAt: 'desc' }]
        break
      default:
        orderBy = [{ createdAt: 'desc' }]
    }

    const works = await prisma.work.findMany({
      where,
      include: {
        user: {
          select: { id: true, name: true, image: true }
        },
      },
      orderBy,
      skip,
      take: limit,
    })

    const total = await prisma.work.count({ where })
    let items = works.map(toHomepageItem)

    return NextResponse.json({
      success: true,
      data: items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching section items:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch section items', message: error.message },
      { status: 500 }
    )
  }
}