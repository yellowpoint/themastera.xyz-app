import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/works/[id]/views - Increment view count
export async function POST(request, { params }) {
  try {
    const { id } = await params

    // Check if work exists
    const work = await prisma.work.findUnique({
      where: { id },
      select: { id: true, views: true }
    })

    if (!work) {
      return NextResponse.json(
        { success: false, error: 'Work not found' },
        { status: 404 }
      )
    }

    // Increment view count
    const updatedWork = await prisma.work.update({
      where: { id },
      data: {
        views: {
          increment: 1
        }
      },
      select: {
        id: true,
        views: true
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        id: updatedWork.id,
        views: updatedWork.views
      }
    })

  } catch (error) {
    console.error('Error incrementing view count:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to increment view count' },
      { status: 500 }
    )
  }
}