import { apiFailure, apiSuccess } from '@/contracts/types/common'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    const normalizedEmail = String(email || '').trim()
    if (!normalizedEmail) {
      return NextResponse.json(
        apiFailure('VALIDATION_FAILED', 'Email is required'),
        { status: 400 }
      )
    }
    if (!normalizedEmail.includes('@')) {
      return NextResponse.json(
        apiFailure('VALIDATION_FAILED', 'Invalid email'),
        { status: 400 }
      )
    }

    const existingApplication = await prisma.betaApplication.findUnique({
      where: { email: normalizedEmail },
    })

    if (existingApplication) {
      return NextResponse.json(
        apiSuccess({
          message: 'Application already exists',
          status: existingApplication.status,
          exists: true,
        })
      )
    }

    const newApplication = await prisma.betaApplication.create({
      data: {
        email: normalizedEmail,
        status: 'PENDING',
      },
    })

    return NextResponse.json(
      apiSuccess({
        message: 'Application submitted successfully',
        status: newApplication.status,
        exists: false,
      })
    )
  } catch (error) {
    console.error('Error submitting application:', error)
    return NextResponse.json(
      apiFailure('INTERNAL_ERROR', 'Failed to submit application', {
        message: (error as any)?.message,
      }),
      { status: 500 }
    )
  }
}
