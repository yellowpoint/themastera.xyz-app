import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { apiSuccess, apiFailure } from '@/contracts/types/common'
import type { Prisma } from '@prisma/client'
import { requireAdmin } from '@/middleware/auth'

// GET /api/admin/works - Admin: list all works with filters/sorting/pagination
export async function GET(request: NextRequest) {
  try {
    // Ensure admin access
    const adminResult = await requireAdmin(request)
    if (adminResult) return adminResult

    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q') || ''
    const category = searchParams.get('category') || ''
    const language = searchParams.get('language') || ''
    const status = searchParams.get('status') || ''
    const quickPickParam = searchParams.get('quickPick') || ''
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '20', 10)
    const sortBy = searchParams.get('sortBy') || 'createdAt' // createdAt, views, downloads, title, status
    const order = (searchParams.get('order') || 'desc') as 'asc' | 'desc'

    const skip = Math.max(0, (page - 1) * limit)

    const where: Prisma.WorkWhereInput = {}

    if (category) where.category = category
    if (language && language !== 'all') (where as any).language = language
    if (status && status !== 'all') where.status = status
    if (quickPickParam) {
      const qp = quickPickParam.toLowerCase()
      if (qp === 'yes' || qp === 'true') (where as any).quickPick = true
      else if (qp === 'no' || qp === 'false') (where as any).quickPick = false
    }

    const or: Prisma.WorkWhereInput['OR'] = []
    const query = q.trim()
    if (query) {
      or.push({ title: { contains: query } })
      or.push({ description: { contains: query } })
      or.push({ tags: { contains: query } })
    }
    if (or.length) (where as any).OR = or

    // Validate sort field
    const sortableFields: Array<keyof Prisma.WorkOrderByWithRelationInput> = [
      'createdAt',
      'updatedAt',
      'views',
      'downloads',
      'title',
      'status',
    ]
    const orderBy: Prisma.WorkOrderByWithRelationInput =
      sortableFields.includes(sortBy as any)
        ? { [sortBy]: order }
        : { createdAt: 'desc' }

    const [items, total] = await Promise.all([
      prisma.work.findMany({
        where,
        include: {
          user: { select: { id: true, name: true, image: true, level: true } },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.work.count({ where }),
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
    console.error('Error in admin works API:', error)
    return NextResponse.json(
      apiFailure('INTERNAL_ERROR', 'Failed to fetch works', { message: (error as any)?.message }),
      { status: 500 }
    )
  }
}