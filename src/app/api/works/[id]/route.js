import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/works/[id] - 获取单个作品
export async function GET(request, { params }) {
  try {
    const { id } = params

    const work = await prisma.work.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        reviews: {
          select: {
            rating: true,
            comment: true,
            createdAt: true,
            user: {
              select: {
                name: true,
                avatar: true
              }
            }
          }
        },
        purchases: {
          select: {
            id: true,
            userId: true,
            createdAt: true
          }
        }
      }
    })

    if (!work) {
      return NextResponse.json(
        { success: false, error: 'Work not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: work
    })

  } catch (error) {
    console.error('Error fetching work:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch work',
        message: error.message 
      },
      { status: 500 }
    )
  }
}

// PUT /api/works/[id] - 更新作品
export async function PUT(request, { params }) {
  try {
    const { id } = params
    const body = await request.json()

    // 检查作品是否存在
    const existingWork = await prisma.work.findUnique({
      where: { id }
    })

    if (!existingWork) {
      return NextResponse.json(
        { success: false, error: 'Work not found' },
        { status: 404 }
      )
    }

    // 准备更新数据
    const updateData = {}
    
    if (body.title !== undefined) updateData.title = body.title
    if (body.description !== undefined) updateData.description = body.description
    if (body.category !== undefined) updateData.category = body.category
    if (body.price !== undefined) updateData.price = parseFloat(body.price)
    if (body.tags !== undefined) updateData.tags = body.tags
    if (body.status !== undefined) updateData.status = body.status
    if (body.fileUrl !== undefined) updateData.fileUrl = body.fileUrl

    // 更新作品
    const work = await prisma.work.update({
      where: { id },
      data: updateData,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: work
    })

  } catch (error) {
    console.error('Error updating work:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update work',
        message: error.message 
      },
      { status: 500 }
    )
  }
}

// DELETE /api/works/[id] - 删除作品
export async function DELETE(request, { params }) {
  try {
    const { id } = params

    // 检查作品是否存在
    const existingWork = await prisma.work.findUnique({
      where: { id }
    })

    if (!existingWork) {
      return NextResponse.json(
        { success: false, error: 'Work not found' },
        { status: 404 }
      )
    }

    // 删除作品（注意：这会级联删除相关的reviews和purchases）
    await prisma.work.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Work deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting work:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to delete work',
        message: error.message 
      },
      { status: 500 }
    )
  }
}