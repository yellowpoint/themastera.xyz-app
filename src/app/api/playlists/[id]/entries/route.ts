import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthSession, requireAuth } from '@/middleware/auth'
import { apiSuccess, apiFailure } from '@/contracts/types/common'
import { z } from 'zod'
import { PLAYLIST_ITEMS_MAX_PER_PLAYLIST } from '@/config/limits'

// POST /api/playlists/[id]/entries - add a work to a playlist
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAuth(request)
    if (authResult) return authResult

    const { id: playlistId } = await params
    const body = await request.json()
    const BodySchema = z.object({ workId: z.string().min(1) })
    const parsed = BodySchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        apiFailure('VALIDATION_FAILED', 'workId is required'),
        { status: 400 }
      )
    }

    const { userId } = await getAuthSession(request)

    // Verify playlist ownership
    const playlist = await prisma.playlist.findUnique({
      where: { id: playlistId },
      select: { id: true, userId: true },
    })

    if (!playlist) {
      return NextResponse.json(apiFailure('NOT_FOUND', 'Playlist not found'), {
        status: 404,
      })
    }

    if (playlist.userId !== userId) {
      return NextResponse.json(apiFailure('FORBIDDEN', 'Forbidden'), {
        status: 403,
      })
    }

    // Verify work exists
    const work = await prisma.work.findUnique({
      where: { id: parsed.data.workId },
      select: { id: true },
    })

    if (!work) {
      return NextResponse.json(apiFailure('NOT_FOUND', 'Work not found'), {
        status: 404,
      })
    }

    // Check if entry already exists
    const existingEntry = await prisma.playlistEntry.findUnique({
      where: { playlistId_workId: { playlistId, workId: parsed.data.workId } },
      select: { id: true },
    })

    // Enforce maximum items per playlist for new entries
    if (!existingEntry) {
      const count = await prisma.playlistEntry.count({ where: { playlistId } })
      if (count >= PLAYLIST_ITEMS_MAX_PER_PLAYLIST) {
        return NextResponse.json(
          apiFailure('CONFLICT', `Maximum ${PLAYLIST_ITEMS_MAX_PER_PLAYLIST} items per playlist`),
          { status: 409 }
        )
      }
    }

    // Add work to playlist (idempotent)
    const entry = await prisma.playlistEntry.upsert({
      where: { playlistId_workId: { playlistId, workId: parsed.data.workId } },
      update: {},
      create: { playlistId, workId: parsed.data.workId },
    })

    // Touch playlist updatedAt
    await prisma.playlist.update({ where: { id: playlistId }, data: {} })

    return NextResponse.json(apiSuccess({ id: entry.id }), { status: 201 })
  } catch (error) {
    console.error('POST /api/playlists/[id]/entries error:', error)
    return NextResponse.json(
      apiFailure('INTERNAL_ERROR', 'Server error', {
        message: (error as any)?.message,
      }),
      { status: 500 }
    )
  }
}

// DELETE /api/playlists/[id]/entries - remove a work from a playlist
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAuth(request)
    if (authResult) return authResult

    const { id: playlistId } = await params
    const body = await request.json()
    const BodySchema = z.object({ workId: z.string().min(1) })
    const parsed = BodySchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        apiFailure('VALIDATION_FAILED', 'workId is required'),
        { status: 400 }
      )
    }

    const { userId } = await getAuthSession(request)

    // Verify playlist ownership
    const playlist = await prisma.playlist.findUnique({
      where: { id: playlistId },
      select: { id: true, userId: true },
    })

    if (!playlist) {
      return NextResponse.json(apiFailure('NOT_FOUND', 'Playlist not found'), {
        status: 404,
      })
    }

    if (playlist.userId !== userId) {
      return NextResponse.json(apiFailure('FORBIDDEN', 'Forbidden'), {
        status: 403,
      })
    }

    // Delete entry if exists (idempotent)
    const existing = await prisma.playlistEntry.findUnique({
      where: { playlistId_workId: { playlistId, workId: parsed.data.workId } },
      select: { id: true },
    })

    if (existing) {
      await prisma.playlistEntry.delete({
        where: {
          playlistId_workId: { playlistId, workId: parsed.data.workId },
        },
      })
    }

    // Touch playlist updatedAt
    await prisma.playlist.update({ where: { id: playlistId }, data: {} })

    return NextResponse.json(apiSuccess({ removed: true }), { status: 200 })
  } catch (error) {
    console.error('DELETE /api/playlists/[id]/entries error:', error)
    return NextResponse.json(
      apiFailure('INTERNAL_ERROR', 'Server error', {
        message: (error as any)?.message,
      }),
      { status: 500 }
    )
  }
}
