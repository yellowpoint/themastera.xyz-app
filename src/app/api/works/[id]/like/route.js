import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthSession, requireAuth } from '@/middleware/auth'

// POST /api/works/[id]/like - 点赞/取消点赞作品（与踩相斥）
export async function POST(request, { params }) {
  try {
    // 认证
    const authResult = await requireAuth(request)
    if (authResult) return authResult

    const { id: workId } = await params
    const body = await request.json()
    const { action } = body // 'like' or 'unlike'

    if (!['like', 'unlike'].includes(action)) {
      return NextResponse.json(
        { success: false, error: 'Invalid action. Must be "like" or "unlike"' },
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

    if (action === 'like') {
      await prisma.workLike.upsert({
        where: { userId_workId: { userId, workId } },
        update: {},
        create: { userId, workId }
      })
      // 与踩相斥：取消当前用户对该作品的踩
      await prisma.workDislike.deleteMany({ where: { userId, workId } })
    } else {
      await prisma.workLike.deleteMany({
        where: { userId, workId }
      })
    }

    const likesCount = await prisma.workLike.count({ where: { workId } })
    const dislikesCount = await prisma.workDislike.count({ where: { workId } })

    return NextResponse.json({
      success: true,
      data: {
        isLiked: action === 'like',
        likesCount,
        dislikesCount
      }
    })
  } catch (error) {
    console.error('Error liking work:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to like/unlike work', message: error.message },
      { status: 500 }
    )
  }
}

// GET /api/works/[id]/like - 获取作品点赞状态和数量
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

    const likesCount = await prisma.workLike.count({ where: { workId } })
    let isLiked = false
    if (userId) {
      const rel = await prisma.workLike.findUnique({
        where: { userId_workId: { userId, workId } }
      })
      isLiked = !!rel
    }

    return NextResponse.json({
      success: true,
      data: { isLiked, likesCount }
    })
  } catch (error) {
    console.error('Error getting work like state:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get like state', message: error.message },
      { status: 500 }
    )
  }
}