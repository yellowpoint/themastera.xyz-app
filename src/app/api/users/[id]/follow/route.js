import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthSession, requireAuth } from '@/middleware/auth'

// POST /api/users/[id]/follow - 关注/取消关注用户
export async function POST(request, { params }) {
  try {
    const { id: targetUserId } = await params
    const body = await request.json()
    const { action } = body // action: 'follow' or 'unfollow'

    // 认证
    const authResult = await requireAuth(request)
    if (authResult) return authResult

    const { userId } = await getAuthSession(request)

    // 验证必需字段
    if (!action) {
      return NextResponse.json(
        { success: false, error: 'Missing required field: action' },
        { status: 400 }
      )
    }

    // 验证action值
    if (!['follow', 'unfollow'].includes(action)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid action. Must be "follow" or "unfollow"'
        },
        { status: 400 }
      )
    }

    // 不能关注自己
    if (userId === targetUserId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Cannot follow yourself'
        },
        { status: 400 }
      )
    }

    // 检查目标用户是否存在
    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId }
    })

    if (!targetUser) {
      return NextResponse.json(
        { success: false, error: 'Target user not found' },
        { status: 404 }
      )
    }

    // 检查当前用户是否存在
    const currentUser = await prisma.user.findUnique({ where: { id: userId } })
    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: 'Current user not found' },
        { status: 404 }
      )
    }

    if (action === 'follow') {
      // 检查是否已经关注
      const existingFollow = await prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: userId,
            followingId: targetUserId
          }
        }
      })

      if (existingFollow) {
        return NextResponse.json(
          {
            success: false,
            error: 'Already following this user'
          },
          { status: 409 }
        )
      }

      // 创建关注关系
      await prisma.follow.create({
        data: {
          followerId: userId,
          followingId: targetUserId
        }
      })

      return NextResponse.json({
        success: true,
        message: 'Successfully followed user',
        data: {
          action: 'follow',
          followerId: userId,
          followingId: targetUserId
        }
      })

    } else { // unfollow
      // 检查是否已经关注
      const existingFollow = await prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: userId,
            followingId: targetUserId
          }
        }
      })

      if (!existingFollow) {
        return NextResponse.json(
          {
            success: false,
            error: 'Not following this user'
          },
          { status: 409 }
        )
      }

      // 删除关注关系
      await prisma.follow.delete({
        where: {
          followerId_followingId: {
            followerId: userId,
            followingId: targetUserId
          }
        }
      })

      return NextResponse.json({
        success: true,
        message: 'Successfully unfollowed user',
        data: {
          action: 'unfollow',
          followerId: userId,
          followingId: targetUserId
        }
      })
    }

  } catch (error) {
    console.error('Error handling follow action:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to handle follow action',
        message: error.message
      },
      { status: 500 }
    )
  }
}

// GET /api/users/[id]/follow - 获取关注状态和统计
export async function GET(request, { params }) {
  try {
    const { id: targetUserId } = await params
    const { userId } = await getAuthSession(request)

    // 检查目标用户是否存在
    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId }
    })

    if (!targetUser) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // 获取关注统计
    const followersCount = await prisma.follow.count({
      where: { followingId: targetUserId }
    })

    const followingCount = await prisma.follow.count({
      where: { followerId: targetUserId }
    })

    let isFollowing = false
    if (userId) {
      const followRelation = await prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: userId,
            followingId: targetUserId
          }
        }
      })
      isFollowing = !!followRelation
    }

    // 获取最近的关注者（前10个）
    const recentFollowers = await prisma.follow.findMany({
      where: { followingId: targetUserId },
      include: {
        follower: {
          select: {
            id: true,
            name: true,
            image: true,
            level: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    })

    const formattedFollowers = recentFollowers.map(follow => ({
      id: follow.follower.id,
      name: follow.follower.name,
      image: follow.follower.image,
      level: follow.follower.level,
      followedAt: follow.createdAt
    }))

    return NextResponse.json({
      success: true,
      data: {
        targetUserId,
        isFollowing,
        stats: {
          followersCount,
          followingCount
        },
        recentFollowers: formattedFollowers
      }
    })

  } catch (error) {
    console.error('Error fetching follow data:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch follow data',
        message: error.message
      },
      { status: 500 }
    )
  }
}