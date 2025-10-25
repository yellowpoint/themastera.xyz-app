import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

/**
 * 认证中间件 - 从cookie获取用户信息并添加到请求中
 * 根据 Better Auth 文档实现的服务端认证
 * @param {Request} request - 请求对象
 * @returns {Promise<{user: Object|null, session: Object|null}>} 用户和会话信息
 */
export async function getAuthSession(request) {
  try {
    // 使用 Better Auth 的 API 从请求头中获取会话信息
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    return {
      user: session?.user || null,
      session: session || null,
      userId: session?.user?.id || null,
    };
  } catch (error) {
    console.error('Error getting auth session:', error);
    return { user: null, session: null };
  }
}

/**
 * 保护路由中间件 - 确保用户已登录
 * @param {Request} request - 请求对象
 * @returns {Promise<Response|undefined>} 如果未授权则返回错误响应，否则返回undefined继续处理
 */
export async function requireAuth(request) {
  const { user } = await getAuthSession(request);

  if (!user) {
    return NextResponse.json(
      {
        success: false,
        error: 'Unauthorized',
        message: 'You must be logged in to access this resource'
      },
      { status: 401 }
    );
  }

  return undefined;
}