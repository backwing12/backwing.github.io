export default async function handler(req, res) {
  const { endpoint, ...params } = req.query

  if (!endpoint) {
    return res.status(400).json({ error: 'No endpoint provided' })
  }

  const queryString = new URLSearchParams(params).toString()
  const url = `https://api.themoviedb.org/3/${endpoint}?${queryString}&api_key=${process.env.TMDB_API_KEY}`

  let response, data
  try {
    // Give up after 8 seconds so a hanging TMDB doesn't hang the function too
    response = await fetch(url, { signal: AbortSignal.timeout(8000) })
    data = await response.json()
  } catch (err) {
    // Don't log the url, it contains the API key
    console.error('TMDB request failed:', err.message)
    return res.status(502).json({ error: 'Could not reach TMDB' })
  }

  // Pass TMDB's status on, so a failed request isn't reported as a success
  res.status(response.status).json(data)
}
