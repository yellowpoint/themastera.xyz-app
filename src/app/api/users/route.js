import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/users - 获取用户列表
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search')
    const isCreator = searchParams.get('isCreator')

    const skip = (page - 1) * limit

    // 构建查询条件
    const where = {}
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (isCreator !== null && isCreator !== undefined) {
      where.isCreator = isCreator === 'true'
    }

    // 获取用户列表
    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        level: true,
        points: true,
        isCreator: true,
        createdAt: true,
        _count: {
          select: {
            works: true,
            purchases: true,
            reviews: true
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
    const total = await prisma.user.count({ where })

    return NextResponse.json({
      success: true,
      data: users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch users',
        message: error.message 
      },
      { status: 500 }
    )
  }
}

// POST /api/users - 创建用户（通常由同步接口调用）
export async function POST(request) {
  try {
    const body = await request.json()
    
    const { id, email, name, avatar } = body
    
    if (!id || !email) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: id and email' 
        },
        { status: 400 }
      )
    }

    // 检查用户是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { id }
    })

    if (existingUser) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'User already exists' 
        },
        { status: 409 }
      )
    }

    // 创建用户
    const user = await prisma.user.create({
      data: {
        id,
        email,
        name: name || null,
        avatar: avatar || null,
        level: 'User',
        points: 0,
        isCreator: false
      }
    })

    return NextResponse.json({
      success: true,
      data: user
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create user',
        message: error.message 
      },
      { status: 500 }
    )
  }
}