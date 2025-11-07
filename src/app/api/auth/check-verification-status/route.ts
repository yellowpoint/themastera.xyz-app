import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { apiSuccess, apiFailure } from '@/contracts/types/common'

export async function POST(request: NextRequest) {
  try {
    // Get user email from request
    const body = await request.json() as { email?: string }
    const { email } = body

    if (!email) {
      return NextResponse.json(
        apiFailure('VALIDATION_FAILED', 'Email is required'),
        { status: 400 }
      )
    }

    // Check verification status in database
    const user = await prisma.user.findUnique({
      where: {
        email: email
      },
      select: {
        id: true,
        email: true,
        emailVerified: true,
        name: true
      }
    })

    if (!user) {
      return NextResponse.json(
        apiFailure('NOT_FOUND', 'User not found'),
        { status: 404 }
      )
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