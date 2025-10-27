import { NextResponse } from 'next/server'
import Mux from '@mux/mux-node'

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID,
  tokenSecret: process.env.MUX_TOKEN_SECRET,
})

export async function GET(req, { params }) {
  const { id } = params
  if (!id) {
    return NextResponse.json({ success: false, error: 'Missing upload id' }, { status: 400 })
  }
  try {
    const upload = await mux.video.uploads.retrieve(id)
    return NextResponse.json({ success: true, upload })
  } catch (error) {
    console.error('Mux retrieve upload error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to retrieve Mux upload' },
      { status: 500 }
    )
  }
}