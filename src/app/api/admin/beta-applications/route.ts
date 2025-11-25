import { apiFailure, apiSuccess } from '@/contracts/types/common'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/middleware/auth'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/admin/beta-applications - list beta applications (admin)
export async function GET(request: NextRequest) {
  try {
    const adminResult = await requireAdmin(request)
    if (adminResult) return adminResult

    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q') || ''
    const status = searchParams.get('status') || '' // PENDING | APPROVED | REJECTED | ''
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '20', 10)

    const skip = Math.max(0, (page - 1) * limit)

    const where: any = {}
    const query = q.trim()
    if (query) {
      where.email = { contains: query }
    }
    if (status && status !== 'all') {
      where.status = status
    }

    const [items, total] = await Promise.all([
      prisma.betaApplication.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.betaApplication.count({ where }),
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
    console.error('Error in admin beta-applications API:', error)
    return NextResponse.json(
      apiFailure('INTERNAL_ERROR', 'Failed to fetch applications', {
        message: (error as any)?.message,
      }),
      { status: 500 }
    )
  }
}

// POST /api/admin/beta-applications - create/update by email with status
export async function POST(request: NextRequest) {
  try {
    const adminResult = await requireAdmin(request)
    if (adminResult) return adminResult

    const body = await request.json()
    const email = String(body?.email || '').trim()
    const status = String(body?.status || 'APPROVED')
      .trim()
      .toUpperCase()

    if (!email) {
      return NextResponse.json(
        apiFailure('VALIDATION_FAILED', 'Email is required'),
        { status: 400 }
      )
    }
    if (!email.includes('@')) {
      return NextResponse.json(
        apiFailure('VALIDATION_FAILED', 'Invalid email'),
        { status: 400 }
      )
    }
    if (!['PENDING', 'APPROVED', 'REJECTED'].includes(status)) {
      return NextResponse.json(
        apiFailure('VALIDATION_FAILED', 'Invalid status'),
        { status: 400 }
      )
    }

    const item = await prisma.betaApplication.upsert({
      where: { email },
      update: { status },
      create: { email, status },
    })

    return NextResponse.json(apiSuccess(item))
  } catch (error) {
    console.error('Error creating beta application:', error)
    return NextResponse.json(
      apiFailure('INTERNAL_ERROR', 'Failed to create application', {
        message: (error as any)?.message,
      }),
      { status: 500 }
    )
  }
}
