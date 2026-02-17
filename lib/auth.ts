import { createHmac, timingSafeEqual } from 'crypto'

const COOKIE_NAME = 'admin_session'
const SESSION_MAX_AGE_SEC = 60 * 60 * 24 * 7 // 7 days

export type SessionPayload = {
  username: string
  exp: number
}

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET
  if (!secret || secret.length < 16) {
    throw new Error('ADMIN_SESSION_SECRET must be set and at least 16 characters')
  }
  return secret
}

function sign(value: string): string {
  const secret = getSecret()
  const hmac = createHmac('sha256', secret)
  hmac.update(value)
  return hmac.digest('base64url')
}

function encode(payload: SessionPayload): string {
  const json = JSON.stringify(payload)
  const encoded = Buffer.from(json, 'utf-8').toString('base64url')
  const signature = sign(encoded)
  return `${encoded}.${signature}`
}

export function decode(token: string): SessionPayload | null {
  try {
    const secret = getSecret()
    const dot = token.indexOf('.')
    if (dot === -1) return null
    const encoded = token.slice(0, dot)
    const sig = token.slice(dot + 1)
    const hmac = createHmac('sha256', secret)
    hmac.update(encoded)
    const expected = hmac.digest('base64url')
    if (expected.length !== sig.length || !timingSafeEqual(Buffer.from(expected, 'utf-8'), Buffer.from(sig, 'utf-8'))) {
      return null
    }
    const json = Buffer.from(encoded, 'base64url').toString('utf-8')
    const payload = JSON.parse(json) as SessionPayload
    if (typeof payload.exp !== 'number' || payload.exp < Date.now() / 1000) return null
    return payload
  } catch {
    return null
  }
}

export function createSessionCookie(username: string): { name: string; value: string; options: Record<string, unknown> } {
  const exp = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SEC
  const value = encode({ username, exp })
  const isProd = process.env.NODE_ENV === 'production'
  return {
    name: COOKIE_NAME,
    value,
    options: {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax' as const,
      path: '/',
      maxAge: SESSION_MAX_AGE_SEC,
    },
  }
}

export function getSessionFromRequest(request: Request): SessionPayload | null {
  const cookieHeader = request.headers.get('cookie')
  if (!cookieHeader) return null
  const match = cookieHeader.match(new RegExp(`(?:^|;)\\s*${COOKIE_NAME}=([^;]+)`))
  const token = match?.[1]
  if (!token) return null
  return decode(token)
}

export function getSessionFromCookieHeader(cookieHeader: string | null): SessionPayload | null {
  if (!cookieHeader) return null
  const match = cookieHeader.match(new RegExp(`(?:^|;)\\s*${COOKIE_NAME}=([^;]+)`))
  const token = match?.[1]
  if (!token) return null
  return decode(token)
}

export { COOKIE_NAME }
