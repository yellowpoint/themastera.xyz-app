import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { apiSuccess, apiFailure } from '@/contracts/types/common'
import { getAuthSession } from '@/middleware/auth'

// POST /api/works/[id]/views - Increment view count
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    // Check if work exists
    const work = await prisma.work.findUnique({
      where: { id },
      select: { id: true, views: true }
    })

    if (!work) {
      return NextResponse.json(apiFailure('NOT_FOUND', 'Work not found'), { status: 404 })
    }

    // Increment view count
    const updatedWork = await prisma.work.update({
      where: { id },
      data: {
        views: {
          increment: 1
        }
      },
      select: {
        id: true,
        views: true
      }
    })

    // Optionally record watch history for logged-in users
    let historyUpdated = false
    try {
      const { userId } = await getAuthSession(request)
      if (userId) {
        await prisma.watchHistory.upsert({
          where: { userId_workId: { userId, workId: id } },
          update: { watchedAt: new Date() },
          create: { userId, workId: id, watchedAt: new Date() },
        })
        historyUpdated = true
      }
    } catch (e) {
      // Do not fail the request if history recording fails
    }

    return NextResponse.json(
      apiSuccess({ id: updatedWork.id, views: updatedWork.views, historyUpdated })
    )

  } catch (error) {
    console.error('Error incrementing view count:', error)
    return NextResponse.json(apiFailure('INTERNAL_ERROR', 'Failed to increment view count'), { status: 500 })
  }
}
