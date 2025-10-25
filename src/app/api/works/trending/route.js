import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/works/trending - Get trending works
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const limit = parseInt(searchParams.get('limit') || '20')
    const timeframe = searchParams.get('timeframe') || '7d' // 7d, 30d, all

    // Calculate time range
    let dateFilter = {}
    if (timeframe !== 'all') {
      const days = timeframe === '7d' ? 7 : 30
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)
      dateFilter = {
        createdAt: {
          gte: startDate
        }
      }
    }

    // Build query conditions
    const where = {
      status: 'published',
      isActive: true,
      ...dateFilter
    }

    if (category && category !== 'all') {
      where.category = category
    }

    // Get trending works (based on downloads, ratings and recent activity)
    const works = await prisma.work.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        reviews: {
          select: {
            rating: true
          }
        },
        _count: {
          select: {
            purchases: true,
            reviews: true
          }
        }
      },
      orderBy: [
        { downloads: 'desc' },
        { rating: 'desc' },
        { createdAt: 'desc' }
      ],
      take: limit
    })

    // 计算热门度分数并格式化数据
    const formattedWorks = works.map(work => {
      const avgRating = work.reviews.length > 0
        ? work.reviews.reduce((sum, review) => sum + review.rating, 0) / work.reviews.length
        : 0

      // 热门度计算：下载量 * 0.4 + 评分 * 0.3 + 评论数 * 0.3
      const trendingScore = (work.downloads * 0.4) + (avgRating * 0.3) + (work._count.reviews * 0.3)

      return {
        id: work.id,
        title: work.title,
        description: work.description,
        category: work.category,
        thumbnailUrl: work.thumbnailUrl || `/api/placeholder/320/180`,
        price: work.price,
        downloads: work.downloads,
        rating: parseFloat(avgRating.toFixed(1)),
        reviewCount: work._count.reviews,
        purchaseCount: work._count.purchases,
        trendingScore: parseFloat(trendingScore.toFixed(2)),
        createdAt: work.createdAt,
        updatedAt: work.updatedAt,
        user: {
          id: work.user.id,
          name: work.user.name,
          image: work.user.image,
        },
        tags: work.tags,
        // tags: work.tags ? work.tags.split(',').map(tag => tag.trim()) : [],
        duration: generateDuration(work.category), // 模拟时长
        uploadTime: formatUploadTime(work.createdAt),
        premium: work.price > 100 // 简单的premium判断逻辑
      }
    })

    // 按热门度排序
    formattedWorks.sort((a, b) => b.trendingScore - a.trendingScore)

    return NextResponse.json({
      success: true,
      data: formattedWorks,
      meta: {
        total: formattedWorks.length,
        timeframe,
        category: category || 'all'
      }
    })

  } catch (error) {
    console.error('Error fetching trending works:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch trending works',
        message: error.message
      },
      { status: 500 }
    )
  }
}

// 辅助函数：生成模拟时长
function generateDuration(category) {
  const durations = {
    '视觉艺术': ['2:30', '4:15', '6:45', '3:20'],
    '音乐': ['3:45', '4:22', '5:18', '2:55'],
    '动画': ['8:15', '12:30', '6:20', '15:45'],
    '摄影': ['2:18', '3:40', '5:25', '4:10'],
    '设计': ['4:22', '7:30', '5:15', '9:20'],
    '插画': ['6:45', '8:20', '4:35', '11:15']
  }

  const categoryDurations = durations[category] || ['3:30', '5:20', '4:45', '6:15']
  return categoryDurations[Math.floor(Math.random() * categoryDurations.length)]
}

// 辅助函数：格式化上传时间
function formatUploadTime(createdAt) {
  const now = new Date()
  const created = new Date(createdAt)
  const diffInHours = Math.floor((now - created) / (1000 * 60 * 60))

  if (diffInHours < 1) return '刚刚'
  if (diffInHours < 24) return `${diffInHours}小时前`

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `${diffInDays}天前`

  const diffInWeeks = Math.floor(diffInDays / 7)
  if (diffInWeeks < 4) return `${diffInWeeks}周前`

  const diffInMonths = Math.floor(diffInDays / 30)
  return `${diffInMonths}个月前`
}