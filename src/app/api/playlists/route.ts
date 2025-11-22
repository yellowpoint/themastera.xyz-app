import {
  PLAYLISTS_MAX_PER_USER,
  PLAYLIST_ITEMS_MAX_PER_PLAYLIST,
} from '@/config/limits'
import { apiFailure, apiSuccess } from '@/contracts/types/common'
import { prisma } from '@/lib/prisma'
import { getAuthSession, requireAuth } from '@/middleware/auth'
import { NextResponse } from 'next/server'
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

    // Ensure a default playlist exists for the user
    const DEFAULT_NAME = 'Default'
    const hasDefault = await prisma.playlist.findFirst({
      where: { userId, name: DEFAULT_NAME },
      select: { id: true },
    })
    if (!hasDefault) {
      await prisma.playlist.create({
        data: { userId, name: DEFAULT_NAME },
      })
    }

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
          orderBy: { createdAt: 'desc' },
          take: PLAYLIST_ITEMS_MAX_PER_PLAYLIST,
        },
      },
    })

    const items = playlists.map((pl) => ({
      id: pl.id,
      name: pl.name,
      updatedAt: pl.updatedAt?.toISOString?.() || (pl.updatedAt as any),
      items: pl.entries.map((e) => ({
        id: e.work.id,
        title: e.work.title,
        author: e.work.user?.name || 'Unknown',
        thumbnail: e.work.thumbnailUrl || null,
        createdAt:
          e.work.createdAt?.toISOString?.() || (e.work.createdAt as any),
      })),
    }))
    return NextResponse.json(apiSuccess({ items }), { status: 200 })
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

    // Normalize name: trim whitespace
    const name = parsed.data.name.trim()
    if (!name) {
      return NextResponse.json(
        apiFailure('VALIDATION_FAILED', 'Name is required'),
        { status: 400 }
      )
    }

    // Prevent creating playlists with duplicate names for the same user
    const existing = await prisma.playlist.findFirst({
      where: { userId, name },
      select: { id: true },
    })

    if (existing) {
      return NextResponse.json(
        apiFailure('CONFLICT', 'Playlist with the same name already exists'),
        { status: 409 }
      )
    }

    const count = await prisma.playlist.count({ where: { userId } })
    if (count >= PLAYLISTS_MAX_PER_USER) {
      return NextResponse.json(
        apiFailure(
          'CONFLICT',
          `Maximum ${PLAYLISTS_MAX_PER_USER} playlists per user`
        ),
        { status: 409 }
      )
    }

    const created = await prisma.playlist.create({
      data: { name, userId },
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
