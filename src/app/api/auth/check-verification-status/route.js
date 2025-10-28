import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { 
        verified: user.emailVerified,
        email: user.email,
        name: user.name
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Failed to check email verification status:', error)
    return NextResponse.json(
      { error: 'Server error, please try again later' },
      { status: 500 }
    )
  }
}