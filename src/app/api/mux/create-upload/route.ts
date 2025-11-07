import { NextResponse, NextRequest } from 'next/server'
import Mux from '@mux/mux-node'

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID,
  tokenSecret: process.env.MUX_TOKEN_SECRET,
})

export async function POST(req: NextRequest) {
  try {
    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || '*'

  const upload = await mux.video.uploads.create({
    cors_origin: origin,
    new_asset_settings: {
      playback_policies: ['public'],
      // Enable static MP4/M4A renditions via the new API
      static_renditions: [
        { resolution: 'highest' },
      ],
    },
  })

    return NextResponse.json({
      success: true,
      id: upload.id,
      url: upload.url,
    })
  } catch (error: any) {
    console.error('Mux create upload error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create Mux upload' },
      { status: 500 }
    )
  }
}