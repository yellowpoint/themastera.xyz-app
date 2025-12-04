import { apiFailure, apiSuccess } from '@/contracts/types/common'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/middleware/auth'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/admin/users - list users (admin)
export async function GET(request: NextRequest) {
  try {
    const adminResult = await requireAdmin(request)
    if (adminResult) return adminResult

    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q') || ''
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '20', 10)

    const skip = Math.max(0, (page - 1) * limit)

    const where: any = {}
    const query = q.trim()
    if (query) {
      where.OR = [{ email: { contains: query } }, { name: { contains: query } }]
    }

    const [items, total] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.user.count({ where }),
    ])

    return NextResponse.json(
      apiSuccess({
        items,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      })
    )
  } catch (error) {
    console.error('Error in admin users API:', error)
    return NextResponse.json(
      apiFailure('INTERNAL_ERROR', 'Failed to fetch users', {
        message: (error as any)?.message,
      }),
      { status: 500 }
    )
  }
}

// PUT /api/admin/users - update user level
export async function PUT(request: NextRequest) {
  try {
    const adminResult = await requireAdmin(request)
    if (adminResult) return adminResult

    const body = await request.json()
    const { userId, level } = body

    if (!userId || !level) {
      return NextResponse.json(
        apiFailure('VALIDATION_FAILED', 'User ID and Level are required'),
        { status: 400 }
      )
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { level },
    })

    return NextResponse.json(apiSuccess(updatedUser))
  } catch (error) {
    console.error('Error updating user level:', error)
    return NextResponse.json(
      apiFailure('INTERNAL_ERROR', 'Failed to update user level', {
        message: (error as any)?.message,
      }),
      { status: 500 }
    )
  }
}
