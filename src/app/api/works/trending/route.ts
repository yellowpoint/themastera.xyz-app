import { apiFailure, apiSuccess } from '@/contracts/types/common'
import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/works/trending - Get trending works
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const excludeWorkId = searchParams.get('exclude') || undefined

    let where: Prisma.WorkWhereInput = { status: 'published' }

    // Get trending works
    const works = await prisma.work.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, image: true } },
        _count: { select: { purchases: true, reviews: true } },
      },
      orderBy: [{ views: 'desc' }],
      take: limit + 1,
    })

    const formattedWorks = works.map((work) => ({
      id: work.id,
      title: work.title,
      description: work.description,
      thumbnailUrl: work.thumbnailUrl ?? null,
      price: work.price,
      downloads: work.downloads,
      views: work.views,
      rating: work.rating,
      reviewCount: work._count.reviews,
      purchaseCount: work._count.purchases,
      createdAt: work.createdAt,
      updatedAt: work.updatedAt,
      user: {
        id: work.user.id,
        name: work.user.name,
        image: work.user.image,
      },
      tags: work.tags,
      durationSeconds: work.durationSeconds ?? null,
    }))

    const filtered = excludeWorkId
      ? formattedWorks.filter((w) => w.id !== excludeWorkId)
      : formattedWorks
    const items = filtered.slice(0, limit)

    return NextResponse.json(
      apiSuccess({
        items,
        meta: {
          total: items.length,
          exclude: excludeWorkId || null,
          limit,
        },
      }),
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, max-age=0, s-maxage=60, stale-while-revalidate=300',
        },
      }
    )
  } catch (error) {
    console.error('Error fetching trending works:', error)
    return NextResponse.json(
      apiFailure('INTERNAL_ERROR', 'Failed to fetch trending works'),
      { status: 500 }
    )
  }
}

// removed mock helpers
