import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { generateVerifyEmailCallbackURL } from '@/utils/auth'

export async function POST(request) {
  try {
    // Get user email from request
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Call Better Auth sendVerificationEmail
    const result = await auth.api.sendVerificationEmail({
      body: {
        email,
        callbackURL: generateVerifyEmailCallbackURL(email) // Use shared helper to generate callback URL
      }
    })

    if (result.error) {
      return NextResponse.json(
        { error: result.error.message || 'Failed to send verification email' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { message: 'Verification email sent' },
      { status: 200 }
    )

  } catch (error) {
    console.error('Failed to resend verification email:', error)
    return NextResponse.json(
      { error: 'Server error, please try again later' },
      { status: 500 }
    )
  }
}