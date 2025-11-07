import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthSession, requireAuth } from '@/middleware/auth'
import { apiSuccess, apiFailure } from '@/contracts/types/common'
import { z } from 'zod'

// GET /api/playlists - list playlists for current user
export async function GET(request: Request) {
  try {
    const { userId } = await getAuthSession(request)
    if (!userId) {
      return NextResponse.json(apiFailure('UNAUTHORIZED', 'Unauthorized'), {
        status: 401,
      })
    }

    // Parse pagination query params
    const url = new URL(request.url)
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'))
    const limit = Math.max(1, Math.min(100, parseInt(url.searchParams.get('limit') || '50')))

    const playlists = await prisma.playlist.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      include: {
        entries: {
          include: {
            work: {
              include: { user: true },
            },
          },
        },
      },
    })
    const total = playlists.length
    const totalPages = Math.max(1, Math.ceil(total / limit))
    const start = (page - 1) * limit
    const end = start + limit

    const pageSlice = playlists.slice(start, end)

    const items = pageSlice.map((pl) => ({
      id: pl.id,
      name: pl.name,
      items: pl.entries.map((e) => ({
        id: e.work.id,
        title: e.work.title,
        author: e.work.user?.name || 'Unknown',
        thumbnail: e.work.thumbnailUrl || null,
        href: `/content/${e.work.id}`,
      })),
    }))
    return NextResponse.json(
      apiSuccess({
        items,
        pagination: { page, limit, total, totalPages },
      }),
      { status: 200 }
    )
  } catch (error: any) {
    console.error('GET /api/playlists error:', error)
    return NextResponse.json(
      apiFailure('INTERNAL_ERROR', 'Server error', { message: error?.message }),
      { status: 500 }
    )
  }
}

// POST /api/playlists - create a new playlist for current user
export async function POST(request: Request) {
  // Ensure auth
  const unauthorized = await requireAuth(request)
  if (unauthorized) return unauthorized

  try {
    const body = await request.json()
    const BodySchema = z.object({ name: z.string().min(1) })
    const parsed = BodySchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        apiFailure('VALIDATION_FAILED', 'Name is required'),
        { status: 400 }
      )
    }

    const { userId } = await getAuthSession(request)
    const created = await prisma.playlist.create({
      data: { name: parsed.data.name, userId },
    })

    const createdCard = {
      id: created.id,
      name: created.name,
      items: [] as Array<any>,
    }
    return NextResponse.json(apiSuccess(createdCard), { status: 201 })
  } catch (error: any) {
    console.error('POST /api/playlists error:', error)
    return NextResponse.json(
      apiFailure('INTERNAL_ERROR', 'Server error', { message: error?.message }),
      { status: 500 }
    )
  }
}
