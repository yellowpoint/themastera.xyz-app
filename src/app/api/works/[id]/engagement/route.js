import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthSession, requireAuth } from '@/middleware/auth'

// POST /api/works/[id]/engagement - 统一处理点赞/取消点赞、踩/取消踩（相斥）
export async function POST(request, { params }) {
  try {
    const authResult = await requireAuth(request)
    if (authResult) return authResult

    const { id: workId } = await params
    const body = await request.json()
    const { action } = body // 'like' | 'unlike' | 'dislike' | 'undislike'

    if (!['like', 'unlike', 'dislike', 'undislike'].includes(action)) {
      return NextResponse.json(
        { success: false, error: 'Invalid action. Must be one of like, unlike, dislike, undislike' },
        { status: 400 }
      )
    }

    const { userId } = await getAuthSession(request)

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
      await prisma.workDislike.deleteMany({ where: { userId, workId } })
    } else if (action === 'unlike') {
      await prisma.workLike.deleteMany({ where: { userId, workId } })
    } else if (action === 'dislike') {
      await prisma.workDislike.upsert({
        where: { userId_workId: { userId, workId } },
        update: {},
        create: { userId, workId }
      })
      await prisma.workLike.deleteMany({ where: { userId, workId } })
    } else if (action === 'undislike') {
      await prisma.workDislike.deleteMany({ where: { userId, workId } })
    }

    const likesCount = await prisma.workLike.count({ where: { workId } })
    const dislikesCount = await prisma.workDislike.count({ where: { workId } })

    // 当前用户的反应
    let reaction = null
    const liked = await prisma.workLike.findUnique({ where: { userId_workId: { userId, workId } } })
    if (liked) reaction = 'like'
    const disliked = await prisma.workDislike.findUnique({ where: { userId_workId: { userId, workId } } })
    if (disliked) reaction = 'dislike'

    return NextResponse.json({
      success: true,
      data: { reaction, likesCount, dislikesCount }
    })
  } catch (error) {
    console.error('Error updating engagement:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update engagement', message: error.message },
      { status: 500 }
    )
  }
}

// GET /api/works/[id]/engagement - 获取点赞/踩状态与数量（单次请求）
export async function GET(request, { params }) {
  try {
    const { id: workId } = await params
    const { userId } = await getAuthSession(request)

    const work = await prisma.work.findUnique({ where: { id: workId } })
    if (!work) {
      return NextResponse.json(
        { success: false, error: 'Work not found' },
        { status: 404 }
      )
    }

    const likesCount = await prisma.workLike.count({ where: { workId } })
    const dislikesCount = await prisma.workDislike.count({ where: { workId } })

    let reaction = null
    if (userId) {
      const liked = await prisma.workLike.findUnique({ where: { userId_workId: { userId, workId } } })
      if (liked) reaction = 'like'
      const disliked = await prisma.workDislike.findUnique({ where: { userId_workId: { userId, workId } } })
      if (disliked) reaction = 'dislike'
    }

    return NextResponse.json({ success: true, data: { reaction, likesCount, dislikesCount } })
  } catch (error) {
    console.error('Error getting engagement:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get engagement', message: error.message },
      { status: 500 }
    )
  }
}