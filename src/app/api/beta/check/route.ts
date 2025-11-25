import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const email = searchParams.get('email')

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 })
  }

  try {
    const application = await prisma.betaApplication.findUnique({
      where: { email },
    })

    if (application && application.status === 'APPROVED') {
      return NextResponse.json({ allowed: true })
    }

    return NextResponse.json({ allowed: false })
  } catch (error) {
    console.error('Error checking whitelist:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
