import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { apiSuccess, apiFailure } from '@/contracts/types/common'
import type { Prisma } from '@prisma/client'

// GET /api/users - 获取用户列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search')

    const skip = (page - 1) * limit

    // 构建查询条件
    const where: Prisma.UserWhereInput = {}
    
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } }
      ]
    }

    // 获取用户列表
    const users = await prisma.user.findMany({
      where,
      select: {
          id: true,
          email: true,
          name: true,
          image: true,
          description: true,
          level: true,
          points: true,
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

    return NextResponse.json(
      apiSuccess({
        items: users,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      })
    )

  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      apiFailure('INTERNAL_ERROR', 'Failed to fetch users', { message: (error as any)?.message }),
      { status: 500 }
    )
  }
}

// POST /api/users - 创建用户（通常由同步接口调用）
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { id, email, name, image, description } = body
    
    if (!id || !email) {
      return NextResponse.json(
        apiFailure('VALIDATION_FAILED', 'Missing required fields: id and email'),
        { status: 400 }
      )
    }

    // 检查用户是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { id }
    })

    if (existingUser) {
      return NextResponse.json(
        apiFailure('CONFLICT', 'User already exists'),
        { status: 409 }
      )
    }

    // 创建用户
    const user = await prisma.user.create({
      data: {
        id,
        email,
        name: name || null,
        image: image || null,
        description: description || null,
        level: 'User',
        points: 0
      }
    })

    return NextResponse.json(apiSuccess(user), { status: 201 })

  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      apiFailure('INTERNAL_ERROR', 'Failed to create user', { message: (error as any)?.message }),
      { status: 500 }
    )
  }
}