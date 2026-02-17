import { NextResponse } from 'next/server'
import { upsertQuizSession } from '@/lib/data'

export async function POST(request: Request) {
  try {
    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return NextResponse.json({ error: 'Body must be an object' }, { status: 400 })
    }
    const { sessionId, ...partial } = body as Record<string, unknown>
    if (!sessionId || typeof sessionId !== 'string') {
      return NextResponse.json({ error: 'sessionId required' }, { status: 400 })
    }
    await upsertQuizSession(sessionId, partial)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Quiz progress error:', err)
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
  }
}
