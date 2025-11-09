import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthSession, requireAuth } from '@/middleware/auth'
import { apiSuccess, apiFailure } from '@/contracts/types/common'

// GET /api/subscriptions - List creators the current user is following
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    if (authResult) return authResult

    const { userId } = await getAuthSession(request)
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const search = searchParams.get('search')?.trim() || ''

    const skip = (page - 1) * limit

    // Build where clause on following user (not used in current implementation)
    // Note: Prisma with SQLite does not support `mode: 'insensitive'` in filters.
    // If you later switch to a provider that supports it, you can reintroduce case-insensitive search.
    const whereFollowingUser = search
      ? {
          OR: [
            { name: { contains: search } },
            { email: { contains: search } },
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

    return NextResponse.json(
      apiSuccess({
        items: filtered.map((u) => ({
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
    )
  } catch (error) {
    console.error('Error fetching subscriptions:', error)
    return NextResponse.json(
      apiFailure('INTERNAL_ERROR', 'Failed to fetch subscriptions', { message: (error as any)?.message }),
      { status: 500 }
    )
  }
}