import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthSession, requireAuth } from '@/middleware/auth'
import { apiSuccess, apiFailure } from '@/contracts/types/common'
import type { Prisma } from '@prisma/client'

// GET /api/works/stats - 获取作品统计数据
export async function GET(request: NextRequest) {
  try {
    // 验证用户是否已登录
    const authResult = await requireAuth(request)
    if (authResult) return authResult
    
    const { userId } = await getAuthSession(request)

    // 获取作者的所有作品
    const works = await prisma.work.findMany({
      where: {
        userId,
        status: 'published'
      },
      include: {
        reviews: {
          select: {
            rating: true
          }
        }
      }
    })

    // 计算统计数据
    const stats = {
      totalWorks: works.length,
      totalDownloads: works.reduce((sum, work) => sum + (work.downloads || 0), 0),
      totalViews: works.reduce((sum, work) => sum + (work.views || 0), 0),
      totalEarnings: works.reduce((sum, work) => sum + (work.earnings || 0), 0),
      averageRating: 0
    }

    // 计算平均评分
    const allRatings = works.flatMap(work =>
      work.reviews.map(review => review.rating)
    ).filter(rating => rating != null)

    if (allRatings.length > 0) {
      stats.averageRating = allRatings.reduce((sum, rating) => sum + rating, 0) / allRatings.length
    }

    // 获取月度统计（当前月）
    const currentMonth = new Date()
    currentMonth.setDate(1)
    currentMonth.setHours(0, 0, 0, 0)

    const nextMonth = new Date(currentMonth)
    nextMonth.setMonth(nextMonth.getMonth() + 1)

    // 获取本月的购买记录
    const monthlyPurchases = await prisma.purchase.findMany({
      where: {
        work: {
          userId
        },
        createdAt: {
          gte: currentMonth,
          lt: nextMonth
        }
      },
      include: {
        work: {
          select: {
            price: true
          }
        }
      }
    })

    const monthlyStats = {
      monthlyEarnings: monthlyPurchases.reduce((sum, purchase) =>
        sum + (purchase.work.price || 0), 0
      ),
      monthlyViews: 0, // 这需要额外的视图跟踪表
      completionRate: 96 // 这需要额外的逻辑来计算
    }

    return NextResponse.json(apiSuccess({ ...stats, ...monthlyStats }), { status: 200 })

  } catch (error) {
    console.error('Error fetching work stats:', error)
    return NextResponse.json(apiFailure('INTERNAL_ERROR', 'Failed to fetch work stats'), { status: 500 })
  }
}

// POST /api/works/stats - 更新作品统计（如下载量、收益等）
export async function POST(request: NextRequest) {
  try {
    // 验证用户是否已登录
    const authResult = await requireAuth(request)
    if (authResult) return authResult
    
    const body = await request.json()
    const { workId, type, value } = body

    if (!workId || !type) {
      return NextResponse.json(apiFailure('VALIDATION_FAILED', 'Missing required fields: workId, type'), { status: 400 })
    }

    // 检查作品是否存在
    const work = await prisma.work.findUnique({
      where: { id: workId }
    })

    if (!work) {
      return NextResponse.json(
        { success: false, error: 'Work not found' },
        { status: 404 }
      )
    }

    let updateData: Prisma.WorkUpdateInput = {}

    switch (type) {
      case 'download':
        updateData.downloads = (work.downloads || 0) + 1
        break
      case 'earnings':
        updateData.earnings = (work.earnings || 0) + (parseFloat(value) || 0)
        break
      case 'view':
        // 这里可以添加视图计数逻辑
        // 可能需要单独的视图跟踪表
        break
      default:
        return NextResponse.json(apiFailure('VALIDATION_FAILED', 'Invalid type'), { status: 400 })
    }

    // 更新作品统计
    const updatedWork = await prisma.work.update({
      where: { id: workId },
      data: updateData
    })

    return NextResponse.json(apiSuccess(updatedWork), { status: 200 })

  } catch (error) {
    console.error('Error updating work stats:', error)
    return NextResponse.json(apiFailure('INTERNAL_ERROR', 'Failed to update work stats'), { status: 500 })
  }
}