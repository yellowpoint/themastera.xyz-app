import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthSession, requireAuth } from '@/middleware/auth'
import { apiSuccess, apiFailure } from '@/contracts/types/common'

// DELETE /api/history/[workId] - remove a history entry for current user
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ workId: string }> }) {
  try {
    const authResult = await requireAuth(request)
    if (authResult) return authResult

    const { workId } = await params
    const { userId } = await getAuthSession(request)

    if (!workId) {
      return NextResponse.json(apiFailure('VALIDATION_FAILED', 'Missing workId'), { status: 400 })
    }

    // Ensure the entry exists (optional)
    const existing = await prisma.watchHistory.findUnique({
      where: { userId_workId: { userId, workId } }
    })

    if (!existing) {
      return NextResponse.json(apiFailure('NOT_FOUND', 'History entry not found'), { status: 404 })
    }

    await prisma.watchHistory.delete({
      where: { userId_workId: { userId, workId } }
    })

    return NextResponse.json(apiSuccess({ message: 'Deleted' }))
  } catch (error) {
    console.error('DELETE /api/history/[workId] error:', error)
    return NextResponse.json(apiFailure('INTERNAL_ERROR', 'Server error'), { status: 500 })
  }
}