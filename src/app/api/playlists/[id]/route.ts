import { PLAYLIST_ITEMS_MAX_PER_PLAYLIST } from '@/config/limits'
import { apiFailure, apiSuccess } from '@/contracts/types/common'
import { prisma } from '@/lib/prisma'
import { getAuthSession, requireAuth } from '@/middleware/auth'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/playlists/[id] - get single playlist details for current user
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await getAuthSession(request)
    if (!userId) {
      return NextResponse.json(apiFailure('UNAUTHORIZED', 'Unauthorized'), {
        status: 401,
      })
    }

    const { id: playlistId } = await params
    if (!playlistId) {
      return NextResponse.json(
        apiFailure('VALIDATION_FAILED', 'Playlist id is required'),
        { status: 400 }
      )
    }

    const pl = await prisma.playlist.findUnique({
      where: { id: playlistId },
      include: {
        entries: {
          include: {
            work: { include: { user: true } },
          },
          orderBy: { createdAt: 'desc' },
          take: PLAYLIST_ITEMS_MAX_PER_PLAYLIST,
        },
      },
    })

    if (!pl) {
      return NextResponse.json(apiFailure('NOT_FOUND', 'Playlist not found'), {
        status: 404,
      })
    }

    if (pl.userId !== userId) {
      return NextResponse.json(apiFailure('FORBIDDEN', 'Forbidden'), {
        status: 403,
      })
    }

    const data = {
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
    }

    return NextResponse.json(apiSuccess(data), { status: 200 })
  } catch (error) {
    console.error('GET /api/playlists/[id] error:', error)
    return NextResponse.json(apiFailure('INTERNAL_ERROR', 'Server error'), {
      status: 500,
    })
  }
}

// DELETE /api/playlists/[id] - delete a playlist owned by current user
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAuth(request)
    if (authResult) return authResult

    const { id: playlistId } = await params
    if (!playlistId) {
      return NextResponse.json(
        apiFailure('VALIDATION_FAILED', 'Playlist id is required'),
        { status: 400 }
      )
    }

    const { userId } = await getAuthSession(request)

    const playlist = await prisma.playlist.findUnique({
      where: { id: playlistId },
      select: { id: true, userId: true },
    })

    if (!playlist) {
      return NextResponse.json(apiFailure('NOT_FOUND', 'Playlist not found'), {
        status: 404,
      })
    }

    if (playlist.userId !== userId) {
      return NextResponse.json(apiFailure('FORBIDDEN', 'Forbidden'), {
        status: 403,
      })
    }

    await prisma.playlist.delete({ where: { id: playlistId } })

    return NextResponse.json(apiSuccess({ deleted: true }), { status: 200 })
  } catch (error) {
    console.error('DELETE /api/playlists/[id] error:', error)
    return NextResponse.json(
      apiFailure('INTERNAL_ERROR', 'Server error', {
        message: (error as any)?.message,
      }),
      { status: 500 }
    )
  }
}
