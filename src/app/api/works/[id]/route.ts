import { resolveUserCover } from '@/config/covers'
import { apiFailure, apiSuccess } from '@/contracts/types/common'
import { prisma } from '@/lib/prisma'
import { getAuthSession } from '@/middleware/auth'
import type { Prisma } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/works/[id] - Get single work
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const isMinimal =
      searchParams.get('light') === '1' || searchParams.get('minimal') === '1'

    const work = await prisma.work.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            coverImage: true,
          },
        },
        ...(isMinimal
          ? {}
          : {
              reviews: {
                select: {
                  rating: true,
                  comment: true,
                  createdAt: true,
                  user: {
                    select: {
                      name: true,
                      image: true,
                    },
                  },
                },
              },
              purchases: {
                select: {
                  id: true,
                  userId: true,
                  createdAt: true,
                },
              },
            }),
      },
    })

    if (!work) {
      return NextResponse.json(apiFailure('NOT_FOUND', 'Work not found'), {
        status: 404,
      })
    }

    // Get current user session for personalized fields
    const { userId } = await getAuthSession(request)

    // Aggregate engagement counts
    const [likesCount, dislikesCount] = await Promise.all([
      prisma.workLike.count({ where: { workId: id } }),
      prisma.workDislike.count({ where: { workId: id } }),
    ])

    // Determine current user's reaction (mutually exclusive)
    let reaction = null
    if (userId) {
      const [liked, disliked] = await Promise.all([
        prisma.workLike.findFirst({ where: { workId: id, userId } }),
        prisma.workDislike.findFirst({ where: { workId: id, userId } }),
      ])
      reaction = liked ? 'like' : disliked ? 'dislike' : null
    }

    // Author follow info
    const authorId = (work as any).user?.id
    let isFollowing = false
    if (userId && authorId && userId !== authorId) {
      const follow = await prisma.follow.findFirst({
        where: { followerId: userId, followingId: authorId },
      })
      isFollowing = !!follow
    }
    const followersCount = authorId
      ? await prisma.follow.count({ where: { followingId: authorId } })
      : 0

    // Resolve author cover fallback
    const authorCover = resolveUserCover(
      ((work as any).user as any)?.coverImage,
      authorId
    )
    if (work.user) {
      ;(work.user as any).coverImage = authorCover
    }

    return NextResponse.json(
      apiSuccess({
        work,
        engagement: {
          likesCount,
          dislikesCount,
          reaction,
        },
        authorFollow: {
          isFollowing,
          followersCount,
        },
      })
    )
  } catch (error) {
    console.error('Error fetching work:', error)
    return NextResponse.json(
      apiFailure('INTERNAL_ERROR', 'Failed to fetch work'),
      { status: 500 }
    )
  }
}

// PUT /api/works/[id] - Update work
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    // Check if the work exists
    const existingWork = await prisma.work.findUnique({
      where: { id },
    })

    if (!existingWork) {
      return NextResponse.json(apiFailure('NOT_FOUND', 'Work not found'), {
        status: 404,
      })
    }

    // Prepare update data
    const updateData: Prisma.WorkUpdateInput = {}

    if (body.title !== undefined) updateData.title = body.title
    if (body.description !== undefined)
      updateData.description = body.description
    if (body.category !== undefined) updateData.category = body.category
    if (body.price !== undefined) updateData.price = parseFloat(body.price)
    if (body.tags !== undefined) updateData.tags = body.tags
    if (body.status !== undefined) updateData.status = body.status
    if (body.fileUrl !== undefined) updateData.fileUrl = body.fileUrl
    if (body.thumbnailUrl !== undefined)
      updateData.thumbnailUrl = body.thumbnailUrl
    if (body.durationSeconds !== undefined)
      updateData.durationSeconds = parseInt(body.durationSeconds, 10)
    if (body.language !== undefined) updateData.language = body.language
    if (body.isForKids !== undefined) updateData.isForKids = body.isForKids
    if (body.quickPick !== undefined)
      (updateData as any).quickPick = body.quickPick
    if (body.quickPickOrder !== undefined)
      (updateData as any).quickPickOrder =
        typeof body.quickPickOrder === 'number'
          ? body.quickPickOrder
          : parseInt(String(body.quickPickOrder), 10)

    // Update work
    const work = await prisma.work.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    })

    return NextResponse.json(apiSuccess(work))
  } catch (error) {
    console.error('Error updating work:', error)
    return NextResponse.json(
      apiFailure('INTERNAL_ERROR', 'Failed to update work'),
      { status: 500 }
    )
  }
}

// DELETE /api/works/[id] - Delete work
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Check if the work exists
    const existingWork = await prisma.work.findUnique({
      where: { id },
    })

    if (!existingWork) {
      return NextResponse.json(apiFailure('NOT_FOUND', 'Work not found'), {
        status: 404,
      })
    }

    // Delete the work (Note: this will cascade delete related reviews and purchases)
    await prisma.work.delete({
      where: { id },
    })

    return NextResponse.json(
      apiSuccess({ message: 'Work deleted successfully' })
    )
  } catch (error) {
    console.error('Error deleting work:', error)
    return NextResponse.json(
      apiFailure('INTERNAL_ERROR', 'Failed to delete work'),
      { status: 500 }
    )
  }
}
