import { apiFailure, apiSuccess } from '@/contracts/types/common'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { email?: string }
    let email = String(body?.email || '')
      .trim()
      .toLowerCase()

    if (!email) {
      return NextResponse.json(
        apiFailure('VALIDATION_FAILED', 'Email is required'),
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
      select: {
        id: true,
        email: true,
        emailVerified: true,
        name: true,
      },
    })

    if (!user) {
      return NextResponse.json(apiFailure('NOT_FOUND', 'User not found'), {
        status: 404,
      })
    }

    return NextResponse.json(
      apiSuccess({
        verified: user.emailVerified,
        email: user.email,
        name: user.name,
      }),
      { status: 200 }
    )
  } catch (error) {
    console.error('Failed to check email verification status:', error)
    return NextResponse.json(
      apiFailure('INTERNAL_ERROR', 'Server error, please try again later'),
      { status: 500 }
    )
  }
}
