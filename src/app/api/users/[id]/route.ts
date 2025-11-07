import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthSession, requireAuth } from "@/middleware/auth";
import { apiSuccess, apiFailure } from "@/contracts/types/common";
import type { Prisma } from "@prisma/client";

// GET /api/users/[id] - 获取单个用户信息
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        works: {
          select: {
            id: true,
            title: true,
            category: true,
            language: true,
            fileUrl: true,
            thumbnailUrl: true,
            durationSeconds: true,
            status: true,
            downloads: true,
            earnings: true,
            rating: true,
            views: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(apiFailure('NOT_FOUND', 'User not found'), { status: 404 });
    }

    // Follow counts
    const [followersCount, followingCount] = await Promise.all([
      prisma.follow.count({ where: { followingId: id } }),
      prisma.follow.count({ where: { followerId: id } }),
    ]);

    // Check if current logged-in user follows this user
    const { userId } = await getAuthSession(request);
    let isFollowing = false;
    if (userId) {
      const followRelation = await prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: userId,
            followingId: id,
          },
        },
      });
      isFollowing = !!followRelation;
    }

    return NextResponse.json(
      apiSuccess({
        ...user,
        followersCount,
        followingCount,
        isFollowing,
      })
    );
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      apiFailure('INTERNAL_ERROR', 'Failed to fetch user', { message: (error as any)?.message }),
      { status: 500 }
    );
  }
}

// PUT /api/users/[id] - 更新用户信息
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Require auth
    const authResult = await requireAuth(request);
    if (authResult) return authResult;

    const { id } = await params;
    const body: Partial<{ name: string; image: string; description: string; level: string; points: number | string }> = await request.json();

    const { userId } = await getAuthSession(request);
    if (userId !== id) {
      return NextResponse.json(
        apiFailure('FORBIDDEN', 'Forbidden: You can only update your own profile'),
        { status: 403 }
      );
    }

    // 检查用户是否存在
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json(apiFailure('NOT_FOUND', 'User not found'), { status: 404 });
    }

    // 准备更新数据
    const updateData: Prisma.UserUpdateInput = {};

    if (body.name !== undefined) updateData.name = body.name;
    if (body.image !== undefined) updateData.image = body.image;
    if (body.description !== undefined)
      updateData.description = body.description;
    if (body.level !== undefined) updateData.level = body.level;
    if (body.points !== undefined) updateData.points = typeof body.points === 'string' ? parseInt(body.points, 10) : body.points;

    // 更新用户
    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      include: {
        _count: {
          select: {
            works: true,
            purchases: true,
            reviews: true,
          },
        },
      },
    });

    return NextResponse.json(apiSuccess(user));
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      apiFailure('INTERNAL_ERROR', 'Failed to update user', { message: (error as any)?.message }),
      { status: 500 }
    );
  }
}

// DELETE /api/users/[id] - 删除用户（软删除或硬删除）
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Require auth
    const authResult = await requireAuth(request);
    if (authResult) return authResult;

    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const force = searchParams.get("force") === "true";

    const { userId } = await getAuthSession(request);
    if (userId !== id) {
      return NextResponse.json(
        apiFailure('FORBIDDEN', 'Forbidden: You can only delete your own account'),
        { status: 403 }
      );
    }

    // 检查用户是否存在
    const existingUser = await prisma.user.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            works: true,
            purchases: true,
            reviews: true,
          },
        },
      },
    });

    if (!existingUser) {
      return NextResponse.json(apiFailure('NOT_FOUND', 'User not found'), { status: 404 });
    }

    // 检查是否有关联数据
    const hasRelatedData =
      existingUser._count.works > 0 ||
      existingUser._count.purchases > 0 ||
      existingUser._count.reviews > 0;

    if (hasRelatedData && !force) {
      return NextResponse.json(
        apiFailure('CONFLICT', 'User has related data. Use force=true to delete anyway.', { relatedData: existingUser._count }),
        { status: 409 }
      );
    }

    // 删除用户（Prisma会根据schema中的onDelete设置处理关联数据）
    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json(apiSuccess({ deleted: true }));
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      apiFailure('INTERNAL_ERROR', 'Failed to delete user', { message: (error as any)?.message }),
      { status: 500 }
    );
  }
}
