import { apiFailure, apiSuccess } from '@/contracts/types/common'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/middleware/auth'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit
    const status = searchParams.get('status')

    const where: any = {}
    if (q) {
      where.title = { contains: q }
    }
    if (status && status !== 'all') {
      where.status = status
    }

    const [items, total] = await Promise.all([
      prisma.event.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.event.count({ where }),
    ])

    // Parse dates for each item if needed, but usually list view might not need full dates array parsed
    // But consistency is good.
    const formattedItems = items.map((item) => {
      let parsedDates = []
      if (item.dates) {
        try {
          parsedDates = JSON.parse(item.dates)
        } catch (e) {}
      }
      return { ...item, dates: parsedDates }
    })

    return NextResponse.json(
      apiSuccess({
        items: formattedItems,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      })
    )
  } catch (error) {
    console.error('Error fetching events:', error)
    return NextResponse.json(
      apiFailure('INTERNAL_ERROR', 'Failed to fetch events', {
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
    if (!body.title) {
      return NextResponse.json(
        apiFailure('VALIDATION_FAILED', 'Title is required'),
        { status: 400 }
      )
    }

    const event = await prisma.event.create({
      data: {
        title: body.title,
        status: body.status || 'Upcoming',
        artistName: body.artistName,
        artistAvatar: body.artistAvatar,
        artistDetailName: body.artistDetailName,
        artistDetailAvatar: body.artistDetailAvatar,
        artistBirth: body.artistBirth,
        artistBio: body.artistBio,
        period: body.period,
        location: body.location,
        posterUrl: body.posterUrl,
        introductionImageUrl: body.introductionImageUrl,
        introductionVideoCover: body.introductionVideoCover,
        exhibitionName: body.exhibitionName,
        exhibitionDuration: body.exhibitionDuration,
        exhibitionLocation: body.exhibitionLocation,
        exhibitionCurator: body.exhibitionCurator,
        dates: body.dates ? JSON.stringify(body.dates) : null,
      },
    })

    return NextResponse.json(apiSuccess(event), { status: 201 })
  } catch (error) {
    console.error('Error creating event:', error)
    return NextResponse.json(
      apiFailure('INTERNAL_ERROR', 'Failed to create event', {
        message: (error as any)?.message,
      }),
      { status: 500 }
    )
  }
}
