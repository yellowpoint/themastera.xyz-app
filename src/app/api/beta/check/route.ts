import { apiFailure, apiSuccess } from '@/contracts/types/common'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const email = searchParams.get('email')

  if (!email) {
    return NextResponse.json(
      apiFailure('VALIDATION_FAILED', 'Email is required'),
      { status: 400 }
    )
  }

  try {
    const application = await prisma.betaApplication.findUnique({
      where: { email },
    })

    const allowed = !!(application && application.status === 'APPROVED')
    return NextResponse.json(apiSuccess({ allowed }))
  } catch (error) {
    console.error('Error checking whitelist:', error)
    return NextResponse.json(
      apiFailure('INTERNAL_ERROR', 'Failed to check beta whitelist', {
        message: (error as any)?.message,
      }),
      { status: 500 }
    )
  }
}
