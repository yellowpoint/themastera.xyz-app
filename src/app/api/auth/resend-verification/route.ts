import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { generateVerifyEmailCallbackURL } from '@/utils/auth'
import { z } from 'zod'
import { apiSuccess, apiFailure } from '@/contracts/types/common'

export async function POST(request: NextRequest) {
  try {
    // Get user email from request
    const body = await request.json()
    const BodySchema = z.object({ email: z.string().email() })
    const parsed = BodySchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        apiFailure('VALIDATION_FAILED', 'Valid email is required'),
        { status: 400 }
      )
    }

    const origin = request.nextUrl.origin
    const result = await auth.api.sendVerificationEmail({
      body: {
        email: parsed.data.email,
        callbackURL: generateVerifyEmailCallbackURL(parsed.data.email, origin) // Use shared helper to generate callback URL
      }
    })

    const anyResult = result as any
    if (anyResult?.error) {
      return NextResponse.json(
        apiFailure('VALIDATION_FAILED', anyResult.error?.message || 'Failed to send verification email'),
        { status: 400 }
      )
    }

    return NextResponse.json(apiSuccess({ sent: true }), { status: 200 })

  } catch (error) {
    console.error('Failed to resend verification email:', error)
    return NextResponse.json(
      apiFailure('INTERNAL_ERROR', 'Server error, please try again later', { message: (error as any)?.message }),
      { status: 500 }
    )
  }
}