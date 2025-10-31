import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthSession, requireAuth } from '@/middleware/auth'

// GET /api/works - Get works list
export async function GET(request) {
  try {
    // 验证用户是否已登录
    const authResult = await requireAuth(request)
    if (authResult) return authResult
    
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    const { userId } = await getAuthSession(request)

    // Build query conditions
    const where = {}

    if (userId) {
      where.userId = userId
    }

    if (category) {
      where.category = category
    }

    if (status) {
      where.status = status
    }

    // 查询作品列表
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
        purchases: {
          select: {
            id: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limit
    })

    // 获取总数
    const total = await prisma.work.count({ where })

    return NextResponse.json({
      success: true,
      data: works,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Error fetching works:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch works',
        message: error.message
      },
      { status: 500 }
    )
  }
}

// POST /api/works - Create new work
export async function POST(request) {
  try {
    // 验证用户是否已登录
    const authResult = await requireAuth(request)
    if (authResult) return authResult
    
    // 从cookie获取用户信息
    const { userId } = await getAuthSession(request)

    const body = await request.json()

    // Validate required fields
    const { title, description, category } = body

    if (!title || !description || !category) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
          required: ['title', 'description', 'category']
        },
        { status: 400 }
      )
    }

    // 准备创建数据，使用cookie中的用户ID
    const createData = {
      title,
      description,
      category,
      userId,
      price: parseFloat(body.price) || 0,
      tags: body.tags || null,
      fileUrl: body.fileUrl || null,
      thumbnailUrl: body.thumbnailUrl || null,
      durationSeconds: body.durationSeconds !== undefined ? parseInt(body.durationSeconds, 10) : null,
      status: body.status || 'draft',
      isActive: body.isActive !== undefined ? body.isActive : true
    }

    // 创建作品
    const work = await prisma.work.create({
      data: createData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: work
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating work:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create work',
        message: error.message
      },
      { status: 500 }
    )
  }
}