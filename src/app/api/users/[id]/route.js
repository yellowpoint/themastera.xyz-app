import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/users/[id] - 获取单个用户信息
export async function GET(request, { params }) {
  try {
    const { id } = await params

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        works: {
          select: {
            id: true,
            title: true,
            category: true,
            language: true,
            fileUrl: true,
            thumbnailUrl: true,
            durationSeconds: true,
            status: true,
            downloads: true,
            earnings: true,
            rating: true,
            createdAt: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        purchases: {
          select: {
            id: true,
            amount: true,
            createdAt: true,
            work: {
              select: {
                id: true,
                title: true,
                category: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        reviews: {
          select: {
            id: true,
            rating: true,
            comment: true,
            createdAt: true,
            work: {
              select: {
                id: true,
                title: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: user
    })

  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch user',
        message: error.message
      },
      { status: 500 }
    )
  }
}

// PUT /api/users/[id] - 更新用户信息
export async function PUT(request, { params }) {
  try {
    const { id } = await params
    const body = await request.json()

    // 检查用户是否存在
    const existingUser = await prisma.user.findUnique({
      where: { id }
    })

    if (!existingUser) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // 准备更新数据
    const updateData = {}

    if (body.name !== undefined) updateData.name = body.name
    if (body.image !== undefined) updateData.image = body.image
    if (body.description !== undefined) updateData.description = body.description
    if (body.level !== undefined) updateData.level = body.level
    if (body.points !== undefined) updateData.points = parseInt(body.points)

    // 更新用户
    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      include: {
        _count: {
          select: {
            works: true,
            purchases: true,
            reviews: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: user
    })

  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update user',
        message: error.message
      },
      { status: 500 }
    )
  }
}

// DELETE /api/users/[id] - 删除用户（软删除或硬删除）
export async function DELETE(request, { params }) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const force = searchParams.get('force') === 'true'

    // 检查用户是否存在
    const existingUser = await prisma.user.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            works: true,
            purchases: true,
            reviews: true
          }
        }
      }
    })

    if (!existingUser) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // 检查是否有关联数据
    const hasRelatedData = existingUser._count.works > 0 ||
      existingUser._count.purchases > 0 ||
      existingUser._count.reviews > 0

    if (hasRelatedData && !force) {
      return NextResponse.json(
        {
          success: false,
          error: 'User has related data. Use force=true to delete anyway.',
          relatedData: existingUser._count
        },
        { status: 409 }
      )
    }

    // 删除用户（Prisma会根据schema中的onDelete设置处理关联数据）
    await prisma.user.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete user',
        message: error.message
      },
      { status: 500 }
    )
  }
}