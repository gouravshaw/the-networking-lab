import { NextResponse } from 'next/server'
import { appendSubmission } from '@/lib/data'

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const record = {
      ...data,
      created_at: data.created_at || new Date().toISOString(),
    }
    await appendSubmission(record)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Submit error:', err)
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
  }
}
