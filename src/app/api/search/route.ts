import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'
import { apiSuccess, apiFailure } from '@/contracts/types/common'

// Map a Work record to a minimal item shape compatible with frontend components
function toSearchItem(work: any) {
  return {
    id: work.id,
    title: work.title || 'Untitled',
    description: work.description ?? undefined,
    thumbnailUrl: work.thumbnailUrl ?? null,
    fileUrl: work.fileUrl ?? null,
    duration: work.duration ?? null,
    durationSeconds: work.durationSeconds ?? null,
    views: work.views ?? 0,
    downloads: work.downloads ?? 0,
    tags: work.tags ?? '',
    language: work.language ?? null,
    category: work.category ?? null,
    user: work.user
      ? { id: work.user.id, name: work.user.name, image: work.user.image }
      : null,
  }
}

// Public search endpoint: does NOT require authentication
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q')
    const category = searchParams.get('category')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    // Base filters: only published and active works are publicly searchable
    const where: Prisma.WorkWhereInput = {
      status: 'published',
      isActive: true,
    }

    if (category) {
      where.category = category
    }

    if (q) {
      const query = q.trim()
      if (query) {
        where.OR = [
          { title: { contains: query } },
          { description: { contains: query } },
          { tags: { contains: query } },
        ]
      }
    }

    const works = await prisma.work.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, image: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    })

    const total = await prisma.work.count({ where })
    const items = works.map(toSearchItem)

    return NextResponse.json(
      apiSuccess({
        items,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      })
    )
  } catch (error) {
    console.error('Error in search API:', error)
    return NextResponse.json(
      apiFailure('INTERNAL_ERROR', 'Failed to perform search', { message: (error as any)?.message }),
      { status: 500 }
    )
  }
}