import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthSession, requireAuth } from '@/middleware/auth'

// POST /api/playlists/[id]/entries - add a work to a playlist
export async function POST(request, { params }) {
  try {
    const authResult = await requireAuth(request)
    if (authResult) return authResult

    const { id: playlistId } = await params
    const body = await request.json()
    const workId = (body?.workId || '').toString().trim()

    if (!workId) {
      return NextResponse.json(
        { success: false, error: 'workId is required' },
        { status: 400 }
      )
    }

    const { userId } = await getAuthSession(request)

    // Verify playlist ownership
    const playlist = await prisma.playlist.findUnique({
      where: { id: playlistId },
      select: { id: true, userId: true }
    })

    if (!playlist) {
      return NextResponse.json(
        { success: false, error: 'Playlist not found' },
        { status: 404 }
      )
    }

    if (playlist.userId !== userId) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      )
    }

    // Verify work exists
    const work = await prisma.work.findUnique({
      where: { id: workId },
      select: { id: true }
    })

    if (!work) {
      return NextResponse.json(
        { success: false, error: 'Work not found' },
        { status: 404 }
      )
    }

    // Add work to playlist (idempotent)
    const entry = await prisma.playlistEntry.upsert({
      where: { playlistId_workId: { playlistId, workId } },
      update: {},
      create: { playlistId, workId }
    })

    // Touch playlist updatedAt
    await prisma.playlist.update({ where: { id: playlistId }, data: {} })

    return NextResponse.json({ success: true, data: { id: entry.id } }, { status: 201 })
  } catch (error) {
    console.error('POST /api/playlists/[id]/entries error:', error)
    return NextResponse.json(
      { success: false, error: 'Server error', message: error.message },
      { status: 500 }
    )
  }
}

// DELETE /api/playlists/[id]/entries - remove a work from a playlist
export async function DELETE(request, { params }) {
  try {
    const authResult = await requireAuth(request)
    if (authResult) return authResult

    const { id: playlistId } = await params
    const body = await request.json()
    const workId = (body?.workId || '').toString().trim()

    if (!workId) {
      return NextResponse.json(
        { success: false, error: 'workId is required' },
        { status: 400 }
      )
    }

    const { userId } = await getAuthSession(request)

    // Verify playlist ownership
    const playlist = await prisma.playlist.findUnique({
      where: { id: playlistId },
      select: { id: true, userId: true }
    })

    if (!playlist) {
      return NextResponse.json(
        { success: false, error: 'Playlist not found' },
        { status: 404 }
      )
    }

    if (playlist.userId !== userId) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      )
    }

    // Delete entry if exists (idempotent)
    const existing = await prisma.playlistEntry.findUnique({
      where: { playlistId_workId: { playlistId, workId } },
      select: { id: true }
    })

    if (existing) {
      await prisma.playlistEntry.delete({
        where: { playlistId_workId: { playlistId, workId } }
      })
    }

    // Touch playlist updatedAt
    await prisma.playlist.update({ where: { id: playlistId }, data: {} })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/playlists/[id]/entries error:', error)
    return NextResponse.json(
      { success: false, error: 'Server error', message: error.message },
      { status: 500 }
    )
  }
}