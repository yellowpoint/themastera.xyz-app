import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { apiFailure } from '@/contracts/types/common'

export interface AuthSession {
  user: any | null
  session: any | null
  userId: string | null
}

/**
 * 认证中间件 - 从cookie获取用户信息并添加到请求中
 * 根据 Better Auth 文档实现的服务端认证
 */
export async function getAuthSession(request: Request): Promise<AuthSession> {
  try {
    const session = await auth.api.getSession({ headers: request.headers })
    return {
      user: session?.user || null,
      session: session || null,
      userId: session?.user?.id || null,
    }
  } catch (error) {
    console.error('Error getting auth session:', error)
    return { user: null, session: null, userId: null }
  }
}

/**
 * 保护路由中间件 - 确保用户已登录
 */
export async function requireAuth(request: Request): Promise<Response | undefined> {
  const { user } = await getAuthSession(request)

  if (!user) {
    return NextResponse.json(
      apiFailure('UNAUTHORIZED', 'You must be logged in to access this resource'),
      { status: 401 }
    )
  }

  return undefined
}