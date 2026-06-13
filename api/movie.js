export default async function handler(req, res) {
  const { endpoint } = req.query

  if (!endpoint) {
    return res.status(400).json({ error: 'No endpoint provided' })
  }

  const response = await fetch(
    `https://api.themoviedb.org/3/${endpoint}&api_key=${process.env.TMDB_API_KEY}`
  )
  const data = await response.json()
  res.status(200).json(data)
}