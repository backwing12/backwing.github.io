export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { password } = req.body

  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Invalid password' })
  }

  // Create a simple signed token: timestamp + secret hash
  const timestamp = Date.now()
  const token = Buffer.from(
    JSON.stringify({ timestamp, secret: process.env.ADMIN_TOKEN_SECRET })
  ).toString('base64')

  return res.status(200).json({ token })
}