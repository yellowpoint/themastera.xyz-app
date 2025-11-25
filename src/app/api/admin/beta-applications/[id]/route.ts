import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { apiSuccess, apiFailure } from '@/contracts/types/common'
import { requireAdmin } from '@/middleware/auth'

// PUT /api/admin/beta-applications/[id] - update status
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const adminResult = await requireAdmin(request)
    if (adminResult) return adminResult

    const { id } = await params
    const body = await request.json()
    const { status } = body as { status?: string }

    if (!id) {
      return NextResponse.json(apiFailure('VALIDATION_FAILED', 'Missing id'), { status: 400 })
    }
    if (!status || !['PENDING', 'APPROVED', 'REJECTED'].includes(status)) {
      return NextResponse.json(apiFailure('VALIDATION_FAILED', 'Invalid status'), { status: 400 })
    }

    const existing = await prisma.betaApplication.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(apiFailure('NOT_FOUND', 'Application not found'), { status: 404 })
    }

    const updated = await prisma.betaApplication.update({
      where: { id },
      data: { status },
    })

    return NextResponse.json(apiSuccess(updated))
  } catch (error) {
    console.error('Error updating beta application:', error)
    return NextResponse.json(
      apiFailure('INTERNAL_ERROR', 'Failed to update application', { message: (error as any)?.message }),
      { status: 500 }
    )
  }
}

