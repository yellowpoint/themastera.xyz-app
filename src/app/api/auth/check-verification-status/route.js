import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request) {
  try {
    // 从请求中获取用户邮箱
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { error: '邮箱地址是必需的' },
        { status: 400 }
      )
    }

    // 查询数据库中该邮箱的验证状态
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
        { error: '用户不存在' },
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
    console.error('检查邮箱验证状态失败:', error)
    return NextResponse.json(
      { error: '服务器错误，请稍后重试' },
      { status: 500 }
    )
  }
}