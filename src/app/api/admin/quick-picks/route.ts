import { apiFailure, apiSuccess } from '@/contracts/types/common'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/middleware/auth'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const adminResult = await requireAdmin(request)
    if (adminResult) return adminResult

    const items = await prisma.work.findMany({
      where: { status: 'published', quickPick: true },
      include: { user: { select: { id: true, name: true, image: true } } },
      orderBy: [{ quickPickOrder: 'asc' }, { createdAt: 'desc' }],
    })

    return NextResponse.json(apiSuccess({ items }))
  } catch (error) {
    return NextResponse.json(
      apiFailure('INTERNAL_ERROR', 'Failed to fetch quick picks', {
        message: (error as any)?.message,
      }),
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const adminResult = await requireAdmin(request)
    if (adminResult) return adminResult

    const body = await request.json()
    const items = Array.isArray(body?.items) ? body.items : []
    const updates = items.map((it: any) => ({
      id: String(it?.id || ''),
      order: Number(it?.order ?? null),
    }))

    if (!updates.length) {
      return NextResponse.json(
        apiFailure('VALIDATION_FAILED', 'Invalid payload'),
        {
          status: 400,
        }
      )
    }

    const result = await prisma.$transaction(
      updates.map((u) =>
        prisma.work.update({
          where: { id: u.id },
          data: { quickPick: true, quickPickOrder: u.order },
        })
      )
    )

    return NextResponse.json(apiSuccess({ items: result }))
  } catch (error) {
    return NextResponse.json(
      apiFailure('INTERNAL_ERROR', 'Failed to reorder quick picks', {
        message: (error as any)?.message,
      }),
      { status: 500 }
    )
  }
}
