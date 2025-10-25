import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/works/[id] - Get single work
export async function GET(request, { params }) {
  try {
    const { id } = await params

    const work = await prisma.work.findUnique({
      where: { id },
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
            rating: true,
            comment: true,
            createdAt: true,
            user: {
              select: {
                name: true,
                image: true
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

// PUT /api/works/[id] - Update work
export async function PUT(request, { params }) {
  try {
    const { id } = await params
    const body = await request.json()

    // Check if the work exists
    const existingWork = await prisma.work.findUnique({
      where: { id }
    })

    if (!existingWork) {
      return NextResponse.json(
        { success: false, error: 'Work not found' },
        { status: 404 }
      )
    }

    // Prepare update data
    const updateData = {}
    
    if (body.title !== undefined) updateData.title = body.title
    if (body.description !== undefined) updateData.description = body.description
    if (body.category !== undefined) updateData.category = body.category
    if (body.price !== undefined) updateData.price = parseFloat(body.price)
    if (body.tags !== undefined) updateData.tags = body.tags
    if (body.status !== undefined) updateData.status = body.status
    if (body.fileUrl !== undefined) updateData.fileUrl = body.fileUrl
    if (body.thumbnailUrl !== undefined) updateData.thumbnailUrl = body.thumbnailUrl

    // Update work
    const work = await prisma.work.update({
      where: { id },
      data: updateData,
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

// DELETE /api/works/[id] - Delete work
export async function DELETE(request, { params }) {
  try {
    const { id } = await params

    // Check if the work exists
    const existingWork = await prisma.work.findUnique({
      where: { id }
    })

    if (!existingWork) {
      return NextResponse.json(
        { success: false, error: 'Work not found' },
        { status: 404 }
      )
    }

    // Delete the work (Note: this will cascade delete related reviews and purchases)
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