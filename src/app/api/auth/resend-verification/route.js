import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

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

    // 调用 Better Auth 的 sendVerificationEmail 方法
    const result = await auth.api.sendVerificationEmail({
      body: {
        email,
        callbackURL: `/auth/verify-email/${encodeURIComponent(encodeURIComponent(email))}` // 验证成功后重定向到验证页面
      }
    })

    if (result.error) {
      return NextResponse.json(
        { error: result.error.message || '发送验证邮件失败' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { message: '验证邮件已发送' },
      { status: 200 }
    )

  } catch (error) {
    console.error('重新发送验证邮件失败:', error)
    return NextResponse.json(
      { error: '服务器错误，请稍后重试' },
      { status: 500 }
    )
  }
}