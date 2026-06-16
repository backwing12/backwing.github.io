export function verifyToken(token) {
  try {
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString())
    const isValidSecret = decoded.secret === process.env.ADMIN_TOKEN_SECRET
    const isNotExpired = Date.now() - decoded.timestamp < 1000 * 60 * 60 * 24 * 7 // 7 days
    return isValidSecret && isNotExpired
  } catch {
    return false
  }
}