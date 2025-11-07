import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthSession, requireAuth } from '@/middleware/auth'
import { apiSuccess, apiFailure } from '@/contracts/types/common'
import type { Prisma } from '@prisma/client'

// GET /api/works - Get works list
export async function GET(request: NextRequest) {
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
    const where: Prisma.WorkWhereInput = {}

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

    return NextResponse.json(
      apiSuccess({
        items: works,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      })
    )

  } catch (error) {
    console.error('Error fetching works:', error)
    return NextResponse.json(
      apiFailure('INTERNAL_ERROR', 'Failed to fetch works', { message: (error as any)?.message }),
      { status: 500 }
    )
  }
}

// POST /api/works - Create new work
export async function POST(request: NextRequest) {
  try {
    // 验证用户是否已登录
    const authResult = await requireAuth(request)
    if (authResult) return authResult
    
    // 从cookie获取用户信息
    const { userId } = await getAuthSession(request)

    const body = await request.json()

    // Validate required fields based on status
    const { title, description, category, status, fileUrl } = body

    // For drafts, only require fileUrl
    if ((status || 'draft') === 'draft') {
      if (!fileUrl) {
        return NextResponse.json(
          apiFailure('VALIDATION_FAILED', 'fileUrl is required for draft'),
          { status: 400 }
        )
      }
    } else {
      // For non-draft (e.g., publish), require core fields
      if (!title || !description || !category) {
        return NextResponse.json(
          apiFailure('VALIDATION_FAILED', 'Missing required fields', { required: ['title', 'description', 'category'] }),
          { status: 400 }
        )
      }
    }

    // 准备创建数据，使用cookie中的用户ID
    const createData = {
      // Only set fields if provided, drafts may omit many fields
      ...(title && { title }),
      ...(description && { description }),
      ...(category && { category }),
      userId,
      price: body.price !== undefined ? parseFloat(body.price) : 0,
      tags: body.tags || null,
      fileUrl: fileUrl || null,
      thumbnailUrl: body.thumbnailUrl || null,
      durationSeconds: body.durationSeconds !== undefined ? parseInt(body.durationSeconds, 10) : null,
      status: status || 'draft',
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

    return NextResponse.json(apiSuccess(work), { status: 201 })

  } catch (error) {
    console.error('Error creating work:', error)
    return NextResponse.json(
      apiFailure('INTERNAL_ERROR', 'Failed to create work', { message: (error as any)?.message }),
      { status: 500 }
    )
  }
}