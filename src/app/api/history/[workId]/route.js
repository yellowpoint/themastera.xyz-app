import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthSession, requireAuth } from '@/middleware/auth'

// DELETE /api/history/[workId] - remove a history entry for current user
export async function DELETE(request, { params }) {
  try {
    const authResult = await requireAuth(request)
    if (authResult) return authResult

    const { workId } = await params
    const { userId } = await getAuthSession(request)

    if (!workId) {
      return NextResponse.json({ success: false, error: 'Missing workId' }, { status: 400 })
    }

    // Ensure the entry exists (optional)
    const existing = await prisma.watchHistory.findUnique({
      where: { userId_workId: { userId, workId } }
    })

    if (!existing) {
      return NextResponse.json({ success: false, error: 'History entry not found' }, { status: 404 })
    }

    await prisma.watchHistory.delete({
      where: { userId_workId: { userId, workId } }
    })

    return NextResponse.json({ success: true, message: 'Deleted' })
  } catch (error) {
    console.error('DELETE /api/history/[workId] error:', error)
    return NextResponse.json(
      { success: false, error: 'Server error', message: error.message },
      { status: 500 }
    )
  }
}