import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { apiSuccess, apiFailure } from '@/contracts/types/common'

// GET /api/works/[id]/comments - 获取作品评论
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: workId } = await params
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const sortBy = searchParams.get('sortBy') || 'newest' // newest, oldest, rating

    const skip = (page - 1) * limit

    // 检查作品是否存在
    const work = await prisma.work.findUnique({
      where: { id: workId }
    })

    if (!work) {
      return NextResponse.json(apiFailure('NOT_FOUND', 'Work not found'), { status: 404 })
    }

    // 构建排序条件
    let orderBy = {}
    switch (sortBy) {
      case 'oldest':
        orderBy = { createdAt: 'asc' }
        break
      case 'rating':
        orderBy = { rating: 'desc' }
        break
      default: // newest
        orderBy = { createdAt: 'desc' }
    }

    // 获取评论列表
    const comments = await prisma.review.findMany({
      where: { workId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            level: true
          }
        }
      },
      orderBy,
      skip,
      take: limit
    })

    // 获取总评论数
    const total = await prisma.review.count({
      where: { workId }
    })

    // 获取评分统计
    const ratingStats = await prisma.review.groupBy({
      by: ['rating'],
      where: { workId },
      _count: {
        rating: true
      }
    })

    // 计算平均评分
    const avgRating = await prisma.review.aggregate({
      where: { workId },
      _avg: {
        rating: true
      }
    })

    // 格式化评论数据
    const formattedComments = comments.map(comment => ({
      id: comment.id,
      rating: comment.rating,
      comment: comment.comment,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      user: {
        id: comment.user.id,
        name: comment.user.name,
        image: comment.user.image,
        level: comment.user.level
      },
      timeAgo: formatTimeAgo(comment.createdAt),
      likes: Math.floor(Math.random() * 50), // 模拟点赞数
      replies: Math.floor(Math.random() * 5)  // 模拟回复数
    }))

    // 格式化评分统计
    const ratingDistribution = [1, 2, 3, 4, 5].map(rating => {
      const stat = ratingStats.find(s => s.rating === rating)
      return {
        rating,
        count: stat ? stat._count.rating : 0
      }
    })

    return NextResponse.json(
      apiSuccess({
        comments: formattedComments,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
        stats: {
          totalComments: total,
          averageRating: avgRating._avg.rating ? parseFloat(avgRating._avg.rating.toFixed(1)) : 0,
          ratingDistribution,
        },
      })
    )

  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json(apiFailure('INTERNAL_ERROR', 'Failed to fetch comments', (error as any)?.message), { status: 500 })
  }
}

// POST /api/works/[id]/comments - 添加评论
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: workId } = await params
    const body = await request.json()
    const { userId, rating, comment } = body as { userId?: string; rating?: number; comment?: string | null }

    // 验证必需字段
    if (!userId || rating == null) {
      return NextResponse.json(
        apiFailure('VALIDATION_FAILED', 'Missing required fields: userId, rating'),
        { status: 400 }
      )
    }

    // 验证评分范围
    if (rating < 1 || rating > 5) {
      return NextResponse.json(apiFailure('VALIDATION_FAILED', 'Rating must be between 1 and 5'), { status: 400 })
    }

    // 检查作品是否存在
    const work = await prisma.work.findUnique({
      where: { id: workId }
    })

    if (!work) {
      return NextResponse.json(apiFailure('NOT_FOUND', 'Work not found'), { status: 404 })
    }

    // 检查用户是否已经评论过
    const existingReview = await prisma.review.findUnique({
      where: {
        userId_workId: {
          userId,
          workId
        }
      }
    })

    if (existingReview) {
      return NextResponse.json(apiFailure('CONFLICT', 'User has already reviewed this work'), { status: 409 })
    }

    // 创建评论
    const newComment = await prisma.review.create({
      data: {
        userId,
        workId,
        rating,
        comment: comment || null
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            level: true
          }
        }
      }
    })

    // 更新作品的平均评分
    const avgRating = await prisma.review.aggregate({
      where: { workId },
      _avg: {
        rating: true
      }
    })

    await prisma.work.update({
      where: { id: workId },
      data: {
        rating: avgRating._avg.rating || 0
      }
    })

    // 格式化返回数据
    const formattedComment = {
      id: newComment.id,
      rating: newComment.rating,
      comment: newComment.comment,
      createdAt: newComment.createdAt,
      updatedAt: newComment.updatedAt,
      user: {
        id: newComment.user.id,
        name: newComment.user.name,
        image: newComment.user.image,
        level: newComment.user.level
      },
      timeAgo: formatTimeAgo(newComment.createdAt),
      likes: 0,
      replies: 0
    }

    return NextResponse.json(apiSuccess(formattedComment), { status: 201 })

  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json(apiFailure('INTERNAL_ERROR', 'Failed to create comment'), { status: 500 })
  }
}

// 辅助函数：格式化时间
function formatTimeAgo(date: string | Date): string {
  const now = new Date()
  const created = new Date(date)
  const diffInMinutes = Math.floor((now.getTime() - created.getTime()) / (1000 * 60))

  if (diffInMinutes < 1) return 'Just now'
  if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours} hours ago`

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `${diffInDays} days ago`

  const diffInWeeks = Math.floor(diffInDays / 7)
  if (diffInWeeks < 4) return `${diffInWeeks} weeks ago`

  const diffInMonths = Math.floor(diffInDays / 30)
  return `${diffInMonths} months ago`
}