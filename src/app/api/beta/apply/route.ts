import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const existingApplication = await prisma.betaApplication.findUnique({
      where: { email },
    })

    if (existingApplication) {
      return NextResponse.json({
        message: 'Application already exists',
        status: existingApplication.status,
      })
    }

    const newApplication = await prisma.betaApplication.create({
      data: {
        email,
        status: 'PENDING',
      },
    })

    return NextResponse.json({
      message: 'Application submitted successfully',
      status: newApplication.status,
    })
  } catch (error) {
    console.error('Error submitting application:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
