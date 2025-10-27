import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthSession, requireAuth } from '@/middleware/auth'

// POST /api/works/[id]/dislike - 踩/取消踩作品
export async function POST(request, { params }) {
  try {
    // 认证
    const authResult = await requireAuth(request)
    if (authResult) return authResult

    const { id: workId } = await params
    const body = await request.json()
    const { action } = body // 'dislike' or 'undislike'

    if (!['dislike', 'undislike'].includes(action)) {
      return NextResponse.json(
        { success: false, error: 'Invalid action. Must be "dislike" or "undislike"' },
        { status: 400 }
      )
    }

    const { userId } = await getAuthSession(request)

    // 检查作品是否存在
    const work = await prisma.work.findUnique({ where: { id: workId } })
    if (!work) {
      return NextResponse.json(
        { success: false, error: 'Work not found' },
        { status: 404 }
      )
    }

    if (action === 'dislike') {
      await prisma.workDislike.upsert({
        where: { userId_workId: { userId, workId } },
        update: {},
        create: { userId, workId }
      })
      // 与赞相斥：取消当前用户对该作品的赞
      await prisma.workLike.deleteMany({ where: { userId, workId } })
    } else {
      await prisma.workDislike.deleteMany({
        where: { userId, workId }
      })
    }

    const dislikesCount = await prisma.workDislike.count({ where: { workId } })
    const likesCount = await prisma.workLike.count({ where: { workId } })

    return NextResponse.json({
      success: true,
      data: {
        isDisliked: action === 'dislike',
        dislikesCount,
        likesCount
      }
    })
  } catch (error) {
    console.error('Error disliking work:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to dislike/undislike work', message: error.message },
      { status: 500 }
    )
  }
}

// GET /api/works/[id]/dislike - 获取作品踩状态
export async function GET(request, { params }) {
  try {
    const { id: workId } = await params
    const { userId } = await getAuthSession(request)

    // 检查作品是否存在
    const work = await prisma.work.findUnique({ where: { id: workId } })
    if (!work) {
      return NextResponse.json(
        { success: false, error: 'Work not found' },
        { status: 404 }
      )
    }

    const dislikesCount = await prisma.workDislike.count({ where: { workId } })
    let isDisliked = false
    if (userId) {
      const rel = await prisma.workDislike.findUnique({
        where: { userId_workId: { userId, workId } }
      })
      isDisliked = !!rel
    }

    return NextResponse.json({
      success: true,
      data: { isDisliked, dislikesCount }
    })
  } catch (error) {
    console.error('Error getting work dislike state:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get dislike state', message: error.message },
      { status: 500 }
    )
  }
}