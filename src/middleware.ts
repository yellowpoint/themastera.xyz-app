import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const origin = request.headers.get('origin') ?? ''

  // 允许的来源列表
  const allowedOrigins = [
    'https://localhost', // 添加这行
    'https://app.themastera.xyz',
    'https://test.themastera.xyz',
  ]

  // 检查是否允许该 Origin
  // 1. 在白名单中
  // 2. 是 Vercel 预览链接 (以 .vercel.app 结尾)
  const isAllowed =
    allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')

  // 如果是 OPTIONS 请求（预检请求），直接返回
  if (request.method === 'OPTIONS') {
    const response = new NextResponse(null, { status: 200 })

    if (isAllowed) {
      response.headers.set('Access-Control-Allow-Origin', origin)
      response.headers.set(
        'Access-Control-Allow-Methods',
        'GET, DELETE, PATCH, POST, PUT, OPTIONS'
      )
      response.headers.set(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version'
      )
      response.headers.set('Access-Control-Allow-Credentials', 'true')
    }

    return response
  }

  const response = NextResponse.next()

  // 为正常请求添加 CORS 头
  if (isAllowed) {
    response.headers.set('Access-Control-Allow-Origin', origin)
    response.headers.set(
      'Access-Control-Allow-Methods',
      'GET, DELETE, PATCH, POST, PUT, OPTIONS'
    )
    response.headers.set(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version'
    )
    response.headers.set('Access-Control-Allow-Credentials', 'true')
  }

  return response
}

export const config = {
  matcher: '/api/:path*',
}
