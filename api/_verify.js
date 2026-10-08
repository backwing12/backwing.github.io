import { createHmac, timingSafeEqual } from 'crypto'

export const TOKEN_LIFETIME_MS = 1000 * 60 * 60 * 24 * 7 // 7 days

function sign(payload) {
  return createHmac('sha256', process.env.ADMIN_TOKEN_SECRET).update(payload).digest('base64url')
}

// Token format: base64url(JSON { exp }) + '.' + HMAC signature of that payload
export function createToken() {
  const payload = Buffer.from(JSON.stringify({ exp: Date.now() + TOKEN_LIFETIME_MS })).toString('base64url')
  return `${payload}.${sign(payload)}`
}

export function safeEqual(a, b) {
  const bufA = Buffer.from(String(a))
  const bufB = Buffer.from(String(b))
  return bufA.length === bufB.length && timingSafeEqual(bufA, bufB)
}

export function verifyToken(token) {
  try {
    const [payload, signature] = token.split('.')
    if (!payload || !signature || !safeEqual(signature, sign(payload))) return false
    const { exp } = JSON.parse(Buffer.from(payload, 'base64url').toString())
    return Date.now() < exp
  } catch {
    return false
  }
}
