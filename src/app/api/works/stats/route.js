import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/works/stats - 获取作品统计数据
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const authorId = searchParams.get('authorId')

    if (!authorId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing authorId parameter' 
        },
        { status: 400 }
      )
    }

    // 获取作者的所有已发布作品
    const works = await prisma.work.findMany({
      where: {
        authorId,
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
          authorId
        },
        createdAt: {
          gte: currentMonth,
          lt: nextMonth
        }
      },
      include: {
        work: {
          select: {
            earnings: true
          }
        }
      }
    })

    const monthlyStats = {
      monthlyEarnings: monthlyPurchases.reduce((sum, purchase) => 
        sum + (purchase.work.earnings || 0), 0
      ),
      monthlyViews: 0, // 这需要额外的视图跟踪表
      completionRate: 96 // 这需要额外的逻辑来计算
    }

    return NextResponse.json({
      success: true,
      data: {
        ...stats,
        ...monthlyStats
      }
    })

  } catch (error) {
    console.error('Error fetching work stats:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch work stats',
        message: error.message 
      },
      { status: 500 }
    )
  }
}

// POST /api/works/stats - 更新作品统计（如下载量、收益等）
export async function POST(request) {
  try {
    const body = await request.json()
    const { workId, type, value } = body

    if (!workId || !type) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: workId, type' 
        },
        { status: 400 }
      )
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

    let updateData = {}

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
        return NextResponse.json(
          { success: false, error: 'Invalid type' },
          { status: 400 }
        )
    }

    // 更新作品统计
    const updatedWork = await prisma.work.update({
      where: { id: workId },
      data: updateData
    })

    return NextResponse.json({
      success: true,
      data: updatedWork
    })

  } catch (error) {
    console.error('Error updating work stats:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update work stats',
        message: error.message 
      },
      { status: 500 }
    )
  }
}