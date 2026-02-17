import { NextResponse } from 'next/server'
import { appendInterestRecord } from '@/lib/data'

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const record = {
      ...data,
      created_at: data.created_at || new Date().toISOString(),
    }
    await appendInterestRecord(record)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Interest save error:', err)
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
  }
}
