import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/middleware/auth'
import { apiSuccess, apiFailure } from '@/contracts/types/common'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const event = await prisma.event.findUnique({ where: { id } })
    
    if (!event) {
      return NextResponse.json(apiFailure('NOT_FOUND', 'Event not found'), { status: 404 })
    }

    let parsedDates = []
    if (event.dates) {
      try {
        parsedDates = JSON.parse(event.dates)
      } catch (e) {}
    }

    return NextResponse.json(apiSuccess({ ...event, dates: parsedDates }))
  } catch (error) {
    console.error('Error fetching event:', error)
    return NextResponse.json(
      apiFailure('INTERNAL_ERROR', 'Failed to fetch event'),
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminResult = await requireAdmin(request)
    if (adminResult) return adminResult

    const { id } = await params
    const body = await request.json()

    const updateData: any = { ...body }
    if (updateData.dates && Array.isArray(updateData.dates)) {
      updateData.dates = JSON.stringify(updateData.dates)
    }
    
    // Clean up fields that shouldn't be updated directly or don't exist on model
    delete updateData.id
    delete updateData.createdAt
    delete updateData.updatedAt

    const event = await prisma.event.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json(apiSuccess(event))
  } catch (error) {
    console.error('Error updating event:', error)
    return NextResponse.json(
      apiFailure('INTERNAL_ERROR', 'Failed to update event'),
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminResult = await requireAdmin(request)
    if (adminResult) return adminResult

    const { id } = await params
    await prisma.event.delete({ where: { id } })

    return NextResponse.json(apiSuccess({ deleted: true }))
  } catch (error) {
    console.error('Error deleting event:', error)
    return NextResponse.json(
      apiFailure('INTERNAL_ERROR', 'Failed to delete event'),
      { status: 500 }
    )
  }
}
