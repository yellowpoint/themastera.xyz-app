import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createServerClient } from '@/lib/supabase'

// POST /api/auth/sync - 同步Supabase Auth用户到本地数据库
export async function POST(request) {
  try {
    const { userId, email, name, avatar } = await request.json()

    if (!userId || !email) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: userId and email' 
        },
        { status: 400 }
      )
    }

    // 检查用户是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { id: userId }
    })

    let user

    if (existingUser) {
      // 更新现有用户信息
      user = await prisma.user.update({
        where: { id: userId },
        data: {
          email,
          name: name || existingUser.name,
          avatar: avatar || existingUser.avatar,
          updatedAt: new Date()
        }
      })
    } else {
      // 创建新用户
      user = await prisma.user.create({
        data: {
          id: userId,
          email,
          name: name || null,
          avatar: avatar || null,
          level: 'User',
          points: 0,
          isCreator: false
        }
      })
    }

    return NextResponse.json({
      success: true,
      data: user
    })

  } catch (error) {
    console.error('Error syncing user:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to sync user',
        message: error.message 
      },
      { status: 500 }
    )
  }
}

// GET /api/auth/sync - 验证并同步当前用户
export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Missing or invalid authorization header' },
        { status: 401 }
      )
    }

    const token = authHeader.split(' ')[1]
    const supabase = createServerClient()

    // 验证Supabase token
    const { data: { user: supabaseUser }, error } = await supabase.auth.getUser(token)

    if (error || !supabaseUser) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      )
    }

    // 同步用户到本地数据库
    const localUser = await prisma.user.upsert({
      where: { id: supabaseUser.id },
      update: {
        email: supabaseUser.email,
        name: supabaseUser.user_metadata?.name || supabaseUser.user_metadata?.full_name,
        avatar: supabaseUser.user_metadata?.avatar_url,
        updatedAt: new Date()
      },
      create: {
        id: supabaseUser.id,
        email: supabaseUser.email,
        name: supabaseUser.user_metadata?.name || supabaseUser.user_metadata?.full_name || null,
        avatar: supabaseUser.user_metadata?.avatar_url || null,
        level: 'User',
        points: 0,
        isCreator: false
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        supabaseUser,
        localUser
      }
    })

  } catch (error) {
    console.error('Error verifying and syncing user:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to verify and sync user',
        message: error.message 
      },
      { status: 500 }
    )
  }
}