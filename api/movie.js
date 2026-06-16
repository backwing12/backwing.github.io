export default async function handler(req, res) {
  const { endpoint, ...params } = req.query

  if (!endpoint) {
    return res.status(400).json({ error: 'No endpoint provided' })
  }

  const queryString = new URLSearchParams(params).toString()
  const url = `https://api.themoviedb.org/3/${endpoint}?${queryString}&api_key=${process.env.TMDB_API_KEY}`

  const response = await fetch(url)
  const data = await response.json()
  res.status(200).json(data)
}