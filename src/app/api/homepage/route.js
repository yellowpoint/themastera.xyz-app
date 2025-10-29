import { NextResponse } from 'next/server'
import { HOMEPAGE_SECTIONS } from '@/config/sections'

// Mock helpers
const rnd = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
const formatDuration = (secs) => {
  const m = Math.floor(secs / 60)
  const s = Math.floor(secs % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

function makeWork(sectionId, idx) {
  const durationSeconds = rnd(60, 360)
  return {
    id: `${sectionId}-${idx}-${rnd(1000, 9999)}`,
    title: `Sample Content ${idx + 1} · ${sectionId.replace(/-/g, ' ')}`,
    thumbnailUrl: `https://picsum.photos/seed/${encodeURIComponent(sectionId)}-${idx}/800/450`,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    user: {
      name: `Artist ${idx + 1}`,
      image: `https://i.pravatar.cc/100?img=${(idx % 70) + 1}`,
    },
    views: rnd(1200, 200000),
    downloads: rnd(100, 5000),
    duration: formatDuration(durationSeconds),
    durationSeconds,
    tags: ['pop', 'featured', 'new'].join(', '),
  }
}

export async function GET() {
  try {
    // Build 8 sections with 4 works each based on config
    const sections = HOMEPAGE_SECTIONS.map((s) => {
      const items = Array.from({ length: 3 }, (_, i) => makeWork(s.id, i))
      return {
        id: s.id,
        title: s.title,
        showAllLink: s.showAllLink,
        items,
      }
    })

    // Quick picks: take first 8 mixed items from sections
    const quickPicks = sections
      .flatMap((sec) => sec.items.map((w) => ({ ...w })))
      .slice(0, 8)

    return NextResponse.json({
      success: true,
      data: {
        quickPicks,
        sections,
      },
    })
  } catch (error) {
    console.error('Error generating homepage mock data:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate homepage data' },
      { status: 500 }
    )
  }
}