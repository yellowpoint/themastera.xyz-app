import { NextResponse, NextRequest } from 'next/server'
import Mux from '@mux/mux-node'

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID,
  tokenSecret: process.env.MUX_TOKEN_SECRET,
})

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!id) {
    return NextResponse.json({ success: false, error: 'Missing upload id' }, { status: 400 })
  }
  try {
    const upload = await mux.video.uploads.retrieve(id)
    return NextResponse.json({ success: true, upload })
  } catch (error: any) {
    console.error('Mux retrieve upload error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to retrieve Mux upload' },
      { status: 500 }
    )
  }
}