import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function extractPlaybackId(url) {
  if (!url) return null
  const match = url.match(/stream\.mux\.com\/([^.?]+)/)
  return match ? match[1] : null
}

function safeFilename(name, fallback = 'video') {
  const raw = (name ?? fallback).toString()
  const cleaned = raw
    // 保留 Unicode 字母与数字，以及常见安全字符；移除 emoji/特殊符号
    .replace(/[^\p{L}\p{N}\-_. ]+/gu, '')
    .trim()
    // 归一化空格为单个空格
    .replace(/\s+/g, ' ')
    // 去掉开头和结尾的点/空格
    .replace(/^[.\s]+|[.\s]+$/g, '')
  const base = (cleaned || fallback).slice(0, 60)
  return base || fallback
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const playbackIdParam = searchParams.get('playbackId')
    const workId = searchParams.get('workId')

    let playbackId = playbackIdParam
    let titleForName = null

    if (!playbackId && workId) {
      const work = await prisma.work.findUnique({ where: { id: workId } })
      if (!work) {
        return NextResponse.json({ success: false, error: 'Work not found' }, { status: 404 })
      }
      titleForName = work.title
      playbackId = extractPlaybackId(work.fileUrl)
    }

    if (!playbackId) {
      return NextResponse.json({ success: false, error: 'Missing playbackId or workId' }, { status: 400 })
    }

    // Use static rendition path and Mux's download param to offload bandwidth
    const downloadBase = safeFilename(titleForName || playbackId, 'video')
    const mp4Url = `https://stream.mux.com/${playbackId}/highest.mp4?download=${encodeURIComponent(downloadBase)}`

    // Redirect to Mux so the browser downloads directly from the CDN
    return NextResponse.redirect(mp4Url, { status: 302 })
  } catch (error) {
    console.error('Mux download error:', error)
    return NextResponse.json(
      { success: false, error: 'Unexpected error while downloading MP4', message: error.message },
      { status: 500 }
    )
  }
}