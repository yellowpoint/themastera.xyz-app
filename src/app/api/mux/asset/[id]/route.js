import { NextResponse } from 'next/server'
import Mux from '@mux/mux-node'

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID,
  tokenSecret: process.env.MUX_TOKEN_SECRET,
})

export async function GET(req, { params }) {
  const { id } = await params
  if (!id) {
    return NextResponse.json({ success: false, error: 'Missing asset id' }, { status: 400 })
  }
  try {
    const asset = await mux.video.assets.retrieve(id)
    return NextResponse.json({ success: true, asset })
  } catch (error) {
    console.error('Mux retrieve asset error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to retrieve Mux asset' },
      { status: 500 }
    )
  }
}