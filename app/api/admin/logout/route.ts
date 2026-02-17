import { NextResponse } from 'next/server'
import { COOKIE_NAME } from '@/lib/auth'

const CLEAR_OPTS = { maxAge: 0, httpOnly: true, sameSite: 'lax' as const }

export async function POST() {
  const res = NextResponse.json({ success: true }, { status: 200 })
  // Clear cookie for both paths so old path=/admin and current path=/ are both removed
  res.cookies.set(COOKIE_NAME, '', { ...CLEAR_OPTS, path: '/' })
  res.cookies.set(COOKIE_NAME, '', { ...CLEAR_OPTS, path: '/admin' })
  return res
}
