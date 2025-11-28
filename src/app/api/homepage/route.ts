import { apiFailure, apiSuccess } from '@/contracts/types/common'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
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
    const { searchParams } = new URL(request.url)
    const limitParam = parseInt(searchParams.get('limit') || '12', 10)
    const limit = Number.isFinite(limitParam) && limitParam > 0 ? limitParam : 12

    const ordered = await prisma.work.findMany({
      where: {
        status: 'published',
        quickPick: true,
        quickPickOrder: { not: null },
      },
      include: {
        user: { select: { id: true, name: true, image: true } },
      },
      orderBy: [{ quickPickOrder: 'asc' }],
      take: limit,
    })

    const remaining = Math.max(limit - ordered.length, 0)
    let fallback: typeof ordered = []
    if (remaining > 0) {
      fallback = await prisma.work.findMany({
        where: {
          status: 'published',
          quickPick: true,
          quickPickOrder: null,
        },
        include: {
          user: { select: { id: true, name: true, image: true } },
        },
        orderBy: [{ createdAt: 'desc' }],
        take: remaining,
      })
    }

    const quickPicksWorks = [...ordered, ...fallback]
    const quickPicks = quickPicksWorks.map(toHomepageItem)

    const res = NextResponse.json(apiSuccess({ quickPicks }), {
      status: 200,
    })
    res.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300')
    return res
  } catch (error) {
    console.error('Error generating homepage data:', error)
    return NextResponse.json(
      apiFailure('INTERNAL_ERROR', 'Failed to generate homepage data', {
        message: (error as any)?.message,
      }),
      { status: 500 }
    )
  }
}
