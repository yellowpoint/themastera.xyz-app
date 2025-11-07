import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthSession, requireAuth } from '@/middleware/auth'

// GET /api/playlists/[id] - get single playlist details for current user
export async function GET(request, { params }) {
  try {
    const { userId } = await getAuthSession(request)
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const playlistId = params?.id
    if (!playlistId) {
      return NextResponse.json({ success: false, error: 'Playlist id is required' }, { status: 400 })
    }

    const pl = await prisma.playlist.findUnique({
      where: { id: playlistId },
      include: {
        entries: {
          include: {
            work: { include: { user: true } },
          },
        },
      },
    })

    if (!pl) {
      return NextResponse.json({ success: false, error: 'Playlist not found' }, { status: 404 })
    }

    if (pl.userId !== userId) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
    }

    const data = {
      id: pl.id,
      name: pl.name,
      items: pl.entries.map((e) => ({
        id: e.work.id,
        title: e.work.title,
        author: e.work.user?.name || 'Unknown',
        thumbnail: e.work.thumbnailUrl || null,
        href: `/content/${e.work.id}`,
      })),
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('GET /api/playlists/[id] error:', error)
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}

// DELETE /api/playlists/[id] - delete a playlist owned by current user
export async function DELETE(request, { params }) {
  try {
    const authResult = await requireAuth(request)
    if (authResult) return authResult

    const playlistId = params?.id
    if (!playlistId) {
      return NextResponse.json({ success: false, error: 'Playlist id is required' }, { status: 400 })
    }

    const { userId } = await getAuthSession(request)

    const playlist = await prisma.playlist.findUnique({
      where: { id: playlistId },
      select: { id: true, userId: true },
    })

    if (!playlist) {
      return NextResponse.json({ success: false, error: 'Playlist not found' }, { status: 404 })
    }

    if (playlist.userId !== userId) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
    }

    await prisma.playlist.delete({ where: { id: playlistId } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/playlists/[id] error:', error)
    return NextResponse.json({ success: false, error: 'Server error', message: error.message }, { status: 500 })
  }
}