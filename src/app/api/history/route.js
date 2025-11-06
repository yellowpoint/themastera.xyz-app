import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthSession, requireAuth } from '@/middleware/auth'

// GET /api/history - list watch history for current user
export async function GET(request) {
  try {
    const { userId } = await getAuthSession(request)
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const limit = Math.max(1, Math.min(50, parseInt(searchParams.get('limit') || '18')))
    const search = (searchParams.get('search') || '').trim()
    const start = searchParams.get('start') // ISO date string
    const end = searchParams.get('end') // ISO date string

    const skip = (page - 1) * limit

    // Date range filter
    const dateFilter = {}
    if (start || end) {
      dateFilter.watchedAt = {}
      if (start) {
        const sd = new Date(start)
        if (!isNaN(sd.getTime())) dateFilter.watchedAt.gte = sd
      }
      if (end) {
        const ed = new Date(end)
        if (!isNaN(ed.getTime())) dateFilter.watchedAt.lte = ed
      }
    }

    // Search filter on work title or author name
    const searchFilter = search
      ? {
          OR: [
            { work: { is: { title: { contains: search } } } },
            { work: { is: { user: { is: { name: { contains: search } } } } } },
          ],
        }
      : {}

    const where = {
      userId,
      ...dateFilter,
      ...searchFilter,
    }

    const [history, total] = await Promise.all([
      prisma.watchHistory.findMany({
        where,
        orderBy: { watchedAt: 'desc' },
        include: {
          work: {
            include: {
              user: {
                select: { id: true, name: true, image: true },
              },
            },
          },
        },
        skip,
        take: limit,
      }),
      prisma.watchHistory.count({ where }),
    ])

    const data = history.map((h) => ({
      id: h.id,
      watchedAt: h.watchedAt,
      work: {
        id: h.work.id,
        title: h.work.title,
        thumbnailUrl: h.work.thumbnailUrl,
        downloads: h.work.downloads,
        views: h.work.views,
        durationSeconds: h.work.durationSeconds,
        user: h.work.user,
      },
    }))

    return NextResponse.json({
      success: true,
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('GET /api/history error:', error)
    return NextResponse.json(
      { success: false, error: 'Server error', message: error.message },
      { status: 500 }
    )
  }
}

// POST /api/history - add or update watch history for current user
export async function POST(request) {
  try {
    const authResult = await requireAuth(request)
    if (authResult) return authResult

    const { userId } = await getAuthSession(request)
    const body = await request.json()
    const { workId } = body

    if (!workId) {
      return NextResponse.json({ success: false, error: 'Missing required field: workId' }, { status: 400 })
    }

    const work = await prisma.work.findUnique({ where: { id: workId } })
    if (!work) {
      return NextResponse.json({ success: false, error: 'Work not found' }, { status: 404 })
    }

    const now = new Date()
    const entry = await prisma.watchHistory.upsert({
      where: { userId_workId: { userId, workId } },
      update: { watchedAt: now },
      create: { userId, workId, watchedAt: now },
      include: {
        work: {
          include: {
            user: {
              select: { id: true, name: true, image: true }
            }
          }
        }
      }
    })

    return NextResponse.json({ success: true, data: entry }, { status: 201 })
  } catch (error) {
    console.error('POST /api/history error:', error)
    return NextResponse.json(
      { success: false, error: 'Server error', message: error.message },
      { status: 500 }
    )
  }
}