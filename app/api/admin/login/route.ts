import { NextResponse } from 'next/server'
import { createSessionCookie, getSessionFromRequest } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const session = getSessionFromRequest(request)
    if (session) {
      return NextResponse.json({ success: true }, { status: 200 })
    }
    const body = await request.json()
    const username = typeof body.username === 'string' ? body.username.trim() : ''
    const password = typeof body.password === 'string' ? body.password : ''
    const adminUser = process.env.ADMIN_USER
    const adminPassword = process.env.ADMIN_PASSWORD
    if (!adminUser || !adminPassword) {
      return NextResponse.json(
        { error: 'Admin login not configured' },
        { status: 500 }
      )
    }
    if (username !== adminUser || password !== adminPassword) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      )
    }
    const cookie = createSessionCookie(username)
    const res = NextResponse.json({ success: true }, { status: 200 })
    res.cookies.set(cookie.name, cookie.value, cookie.options as Record<string, string | number | boolean>)
    return res
  } catch (err) {
    console.error('Admin login error:', err)
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    )
  }
}
