import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { apiSuccess, apiFailure } from '@/contracts/types/common'
import type { Prisma } from '@prisma/client'

// GET /api/works/trending - Get trending works
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const limit = parseInt(searchParams.get('limit') || '20')
    const timeframe = searchParams.get('timeframe') || '7d' // 7d, 30d, all

    // Calculate time range
    let dateFilter: Prisma.WorkWhereInput = {}
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
    const where: Prisma.WorkWhereInput = {
      status: 'published',
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
        // premium removed; frontend will derive paid status from price > 0
      }
    })

    // 按热门度排序
    formattedWorks.sort((a, b) => b.trendingScore - a.trendingScore)

    return NextResponse.json(
      apiSuccess({
        items: formattedWorks,
        meta: {
          total: formattedWorks.length,
          timeframe,
          category: category || 'all',
        },
      }),
      { status: 200 }
    )

  } catch (error) {
    console.error('Error fetching trending works:', error)
    return NextResponse.json(apiFailure('INTERNAL_ERROR', 'Failed to fetch trending works'), { status: 500 })
  }
}

// Helper: generate mock duration
function generateDuration(category?: string): string {
  const durations = {
    'Visual Arts': ['2:30', '4:15', '6:45', '3:20'],
    'Music': ['3:45', '4:22', '5:18', '2:55'],
    'Animation': ['8:15', '12:30', '6:20', '15:45'],
    'Photography': ['2:18', '3:40', '5:25', '4:10'],
    'Design': ['4:22', '7:30', '5:15', '9:20'],
    'Illustration': ['6:45', '8:20', '4:35', '11:15']
  }

  const categoryDurations = (category ? durations[category] : undefined) || ['3:30', '5:20', '4:45', '6:15']
  return categoryDurations[Math.floor(Math.random() * categoryDurations.length)]
}

// Helper: format upload time
function formatUploadTime(createdAt: string | Date): string {
  const now = new Date()
  const created = new Date(createdAt)
  const diffInHours = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60))

  if (diffInHours < 1) return 'Just now'
  if (diffInHours < 24) return `${diffInHours} hours ago`

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `${diffInDays} days ago`

  const diffInWeeks = Math.floor(diffInDays / 7)
  if (diffInWeeks < 4) return `${diffInWeeks} weeks ago`

  const diffInMonths = Math.floor(diffInDays / 30)
  return `${diffInMonths} months ago`
}