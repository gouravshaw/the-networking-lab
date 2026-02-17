/**
 * Edge-compatible session verification for Next.js middleware.
 * Uses Web Crypto API; do not import Node's crypto here.
 */

const COOKIE_NAME = 'admin_session'

export type SessionPayload = {
  username: string
  exp: number
}

function base64UrlDecode(str: string): string {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/')
  const pad = base64.length % 4
  const padded = pad ? base64 + '='.repeat(4 - pad) : base64
  return atob(padded)
}

function base64UrlEncode(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

async function verifySignature(encoded: string, signature: string, secret: string): Promise<boolean> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const sigBuffer = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(encoded)
  )
  const expected = base64UrlEncode(sigBuffer)
  if (expected.length !== signature.length) return false
  let out = 0
  for (let i = 0; i < expected.length; i++) {
    out |= expected.charCodeAt(i) ^ signature.charCodeAt(i)
  }
  return out === 0
}

export async function getSessionFromCookieHeaderEdge(
  cookieHeader: string | null
): Promise<SessionPayload | null> {
  if (!cookieHeader) return null
  const secret = process.env.ADMIN_SESSION_SECRET
  if (!secret || secret.length < 16) return null
  const match = cookieHeader.match(new RegExp(`(?:^|;)\\s*${COOKIE_NAME}=([^;]+)`))
  const token = match?.[1]?.trim()
  if (!token) return null
  const dot = token.indexOf('.')
  if (dot === -1) return null
  const encoded = token.slice(0, dot)
  const sig = token.slice(dot + 1)
  try {
    const ok = await verifySignature(encoded, sig, secret)
    if (!ok) return null
    const json = base64UrlDecode(encoded)
    const payload = JSON.parse(json) as SessionPayload
    if (typeof payload.exp !== 'number' || payload.exp < Date.now() / 1000) return null
    return payload
  } catch {
    return null
  }
}

export { COOKIE_NAME }
