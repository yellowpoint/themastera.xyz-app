import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthSession, requireAuth } from '@/middleware/auth'

// GET /api/subscriptions - List creators the current user is following
export async function GET(request) {
  try {
    const authResult = await requireAuth(request)
    if (authResult) return authResult

    const { userId } = await getAuthSession(request)
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const search = searchParams.get('search')?.trim() || ''

    const skip = (page - 1) * limit

    // Build where clause on following user
    const whereFollowingUser = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {}

    let filtered = []
    let total = 0

    if (search) {
      // Fetch all follows for current user, then filter client-side for search
      const followsAll = await prisma.follow.findMany({
        where: { followerId: userId },
        include: {
          follower: false,
          following: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              description: true,
              level: true,
              _count: {
                select: { works: true, purchases: true, reviews: true },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      })

      const matched = followsAll
        .map((f) => ({ ...f.following }))
        .filter((u) => {
          const hay = `${u.name || ''} ${u.email || ''}`.toLowerCase()
          return hay.includes(search.toLowerCase())
        })

      total = matched.length
      filtered = matched.slice(skip, skip + limit)
    } else {
      // Paginated query when no search
      const follows = await prisma.follow.findMany({
        where: { followerId: userId },
        include: {
          follower: false,
          following: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              description: true,
              level: true,
              _count: {
                select: { works: true, purchases: true, reviews: true },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      })

      filtered = follows.map((f) => ({ ...f.following }))
      total = await prisma.follow.count({ where: { followerId: userId } })
    }

    return NextResponse.json({
      success: true,
      data: filtered.map((u) => ({
        ...u,
        isFollowing: true,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching subscriptions:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch subscriptions', message: error.message },
      { status: 500 }
    )
  }
}