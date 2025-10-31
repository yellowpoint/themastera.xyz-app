import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthSession, requireAuth } from '@/middleware/auth'

// GET /api/playlists - list playlists for current user
export async function GET(request) {
  try {
    const { userId } = await getAuthSession(request)
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
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
        },
      },
    })

    const data = playlists.map((pl) => ({
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

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('GET /api/playlists error:', error)
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}

// POST /api/playlists - create a new playlist for current user
export async function POST(request) {
  // Ensure auth
  const unauthorized = await requireAuth(request)
  if (unauthorized) return unauthorized

  try {
    const body = await request.json()
    const name = (body?.name || '').trim()
    if (!name) {
      return NextResponse.json({ success: false, error: 'Name is required' }, { status: 400 })
    }

    const { userId } = await getAuthSession(request)
    const created = await prisma.playlist.create({
      data: { name, userId },
    })

    return NextResponse.json({ success: true, data: { id: created.id, name: created.name, items: [] } }, { status: 201 })
  } catch (error) {
    console.error('POST /api/playlists error:', error)
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}